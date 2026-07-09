"use client";

import { useEffect, useRef, useState } from "react";
import { generateGoogleReviewUrl } from "@/lib/google-review";

type GoogleBusinessSearchProps = {
  apiKey?: string;
  onConfirm: (place: GoogleBusinessSelection) => void;
};

export type GoogleBusinessSelection = {
  placeId: string;
  name: string;
  formattedAddress: string;
  reviewUrl: string;
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: {
              fields: string[];
              types: string[];
              componentRestrictions: { country: string };
            }
          ) => {
            addListener: (eventName: "place_changed", callback: () => void) => void;
            getPlace: () => {
              place_id?: string;
              name?: string;
              formatted_address?: string;
            };
          };
        };
      };
    };
  }
}

let googleMapsScriptPromise: Promise<void> | null = null;

export function GoogleBusinessSearch({ apiKey, onConfirm }: GoogleBusinessSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "fallback">("idle");
  const [selectedPlace, setSelectedPlace] = useState<GoogleBusinessSelection | null>(null);

  useEffect(() => {
    if (!apiKey || !inputRef.current) {
      setStatus("fallback");
      return;
    }

    let mounted = true;
    setStatus("loading");

    loadGooglePlaces(apiKey)
      .then(() => {
        if (!mounted || !inputRef.current || !window.google?.maps?.places?.Autocomplete) {
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["place_id", "name", "formatted_address"],
          types: ["establishment"],
          componentRestrictions: { country: "us" }
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.place_id || !place.name) {
            return;
          }

          setSelectedPlace({
            placeId: place.place_id,
            name: place.name,
            formattedAddress: place.formatted_address ?? "",
            reviewUrl: generateGoogleReviewUrl(place.place_id)
          });
        });

        setStatus("ready");
      })
      .catch(() => {
        if (mounted) {
          setStatus("fallback");
        }
      });

    return () => {
      mounted = false;
    };
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="rounded-md border border-line bg-soft p-4 text-sm text-muted">
        Google business search is not configured yet. Paste your Google review URL manually below.
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-md border border-line bg-soft p-4">
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Search Google Business Profile
        <input
          ref={inputRef}
          className="rounded-md border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand"
          placeholder="Start typing your business name"
          autoComplete="off"
        />
      </label>

      {status === "loading" ? <p className="text-sm text-muted">Loading Google business search...</p> : null}
      {status === "fallback" ? <p className="text-sm text-muted">Google search could not load. Paste your Google review URL manually below.</p> : null}

      {selectedPlace ? (
        <div className="rounded-md border border-line bg-white p-4 text-sm">
          <p className="font-bold text-ink">{selectedPlace.name}</p>
          {selectedPlace.formattedAddress ? <p className="mt-1 text-muted">{selectedPlace.formattedAddress}</p> : null}
          <p className="mt-3 break-all text-brand">{selectedPlace.reviewUrl}</p>
          <button
            type="button"
            onClick={() => onConfirm(selectedPlace)}
            className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand"
          >
            Use this Google review link
          </button>
        </div>
      ) : null}
    </div>
  );
}

function loadGooglePlaces(apiKey: string) {
  if (window.google?.maps?.places?.Autocomplete) {
    return Promise.resolve();
  }

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-taprater-google-places="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Google Maps script failed to load.")));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.tapraterGooglePlaces = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google Maps script failed to load."));
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
}
