/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  colorName: keyof typeof Colors.light
) {
  return Colors['light'][colorName];
}
