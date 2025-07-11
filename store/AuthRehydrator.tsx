"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./authSlice";

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function AuthRehydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("AuthRehydrator running");
    const token = getCookie('token');
    console.log("Token found:", token);
    if (token) {
      const payload = decodeJwt(token);
      console.log("Decoded payload:", payload);
      if (payload && payload.id && payload.email && payload.role) {
        console.log("Dispatching login with:", payload);
        dispatch(login({
          user: {
            id: payload.id,
            name: payload.name || '',
            email: payload.email,
            role: payload.role,
          },
          token,
        }));
      }
    }
  }, [dispatch]);
  return null;
} 