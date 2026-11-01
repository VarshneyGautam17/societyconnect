'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { societiesByDistance, socShort } from '@/data/societies';
import { loadSocieties } from '@/lib/societies';
import { autoSelectSociety } from '@/store/slices/societySlice';

/* Beyond this, the "nearest" society isn't really near -- better to leave the choice to the
   visitor than to drop them into a society in another city. */
export const NEAR_ENOUGH_KM = 25;

/** Browser geolocation -> nearest society in the database list. Resolves `{ society, km }`,
 *  rejects with an Error whose `code` is 'unsupported' | 'denied' | 'unavailable'. */
export async function locateNearestSociety() {
  const [pos, list] = await Promise.all([currentPosition(), loadSocieties()]);
  const ranked = societiesByDistance(pos.coords.latitude, pos.coords.longitude, list);
  logLocation(pos, ranked);
  if (!ranked.length) throw Object.assign(new Error('no societies'), { code: 'unavailable' });
  return ranked[0];
}

function currentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(Object.assign(new Error('unsupported'), { code: 'unsupported' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => {
        if (process.env.NODE_ENV !== 'production') console.warn('[location] failed:', err.code, err.message);
        reject(Object.assign(new Error(err.message), { code: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable' }));
      },
      /* High accuracy asks for GPS/Wi-Fi positioning instead of a coarse network guess; no cached
         position, so a moved device isn't matched against where it was minutes ago. */
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

/* Dev-only: what the browser actually reported and how far each society is, to sanity-check
   detection (desktop browsers often only have Wi-Fi/IP location, accurate to a few km at best). */
function logLocation(pos, ranked) {
  if (process.env.NODE_ENV === 'production' || !ranked.length) return;
  const { latitude, longitude, accuracy } = pos.coords;
  console.groupCollapsed(`[location] ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)} m) -> nearest: ${ranked[0].society.name}, ${ranked[0].km.toFixed(1)} km`);
  console.log('Coordinates:', { latitude, longitude, accuracyMeters: Math.round(accuracy), at: new Date(pos.timestamp).toLocaleTimeString() });
  console.log('Check on map:', `https://www.google.com/maps?q=${latitude},${longitude}`);
  console.table(ranked.map(({ society, km }) => ({
    society: society.name,
    place: society.place,
    km: Number(km.toFixed(1)),
    autoSelect: km <= NEAR_ENOUGH_KM ? 'yes' : 'too far'
  })));
  console.groupEnd();
}

/** The "Use my location" button's behavior: finds the nearest society, selects it when it's
 *  within NEAR_ENOUGH_KM, and returns a status line describing what happened. */
export function useSocietyLocator(initialMessage = '') {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(initialMessage);
  const [locating, setLocating] = useState(false);

  const locate = useCallback(async () => {
    setLocating(true);
    setMessage('Checking your approximate location...');
    try {
      const { society, km } = await locateNearestSociety();
      if (km <= NEAR_ENOUGH_KM) {
        dispatch(autoSelectSociety(society.id));
        setMessage(`Showing ${socShort(society.id)}, your nearest society. Not yours? Pick another.`);
      } else {
        setMessage(`No SocietySpot society near you yet (closest is ${socShort(society.id)}). Pick one from the list.`);
      }
    } catch (err) {
      setMessage(
        err.code === 'denied'
          ? 'Location blocked. No problem, pick your society from the list.'
          : 'Could not find your location. Pick your society from the list.'
      );
    } finally {
      setLocating(false);
    }
  }, [dispatch]);

  return { message, locating, locate };
}
