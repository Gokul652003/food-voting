import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'food-voting:';

export async function readCollection<T>(key: string, seed: T): Promise<T> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (raw === null) {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Corrupted entry — reset it to the seed so future reads don't keep failing to parse it.
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(seed));
    return seed;
  }
}

export async function writeCollection<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export async function readValue<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeValue<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export async function removeValue(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}
