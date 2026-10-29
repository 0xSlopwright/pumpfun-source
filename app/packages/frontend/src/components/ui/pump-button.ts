type ButtonSize = 32 | 36 | 40 | 44 | 48;
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Class names of the captured `-d3wmW_button` CSS module. Its rules ship in
 * recovered-fonts.css, which is the captured module/font stylesheet.
 */
export function pumpButtonClass({
  size,
  variant = 'primary',
  width,
  rounded = 'base',
}: {
  size: ButtonSize;
  variant?: ButtonVariant;
  width?: 'base' | 'full';
  rounded?: 'base' | 'full';
}): string {
  return [
    '-d3wmW_button',
    `-d3wmW_button__size_${size}`,
    `-d3wmW_button__variant_${variant}`,
    width && `-d3wmW_button__width_${width}`,
    `-d3wmW_button__rounded_${rounded}`,
  ]
    .filter(Boolean)
    .join(' ');
}
