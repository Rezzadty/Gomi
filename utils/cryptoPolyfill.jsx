import * as Crypto from "expo-crypto";

// Polyfill for crypto.getRandomValues to work with crypto-js
if (!global.crypto) {
  global.crypto = {};
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = function getRandomValues(array) {
    // Generate random bytes synchronously
    let randomBytes;
    try {
      // Try using expo-crypto synchronously
      randomBytes = Crypto.getRandomBytes(array.length);
    } catch (e) {
      // If expo-crypto fails, use Math.random as fallback
      console.warn("expo-crypto failed, using Math.random fallback");
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }

    // Copy the random bytes into the array
    for (let i = 0; i < array.length; i++) {
      array[i] = randomBytes[i];
    }

    return array;
  };
}

// Also ensure crypto.subtle exists (sometimes needed)
if (!global.crypto.subtle) {
  global.crypto.subtle = {};
}

console.log("✅ Crypto polyfill initialized successfully");
