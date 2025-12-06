export const generateColoredCursorSVG = (
  color: string,
  userId: string
): string => {
  const filterId = `filter0_d_${userId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const svgString = `
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#${filterId})">
        <path d="M11.8924 23.7113L7.33378 7.71982C7.0984 6.89409 7.95602 6.18106 8.73584 6.55413L23.8385 13.7792C24.6416 14.1634 24.5812 15.3159 23.7425 15.6131L17.5312 17.8139C17.3056 17.8938 17.1164 18.0511 16.9978 18.2574L13.7318 23.9361C13.2908 24.7029 12.1347 24.5616 11.8924 23.7113Z" fill="${color}"/>
        <path d="M6.85075 7.8544C6.49768 6.61583 7.78362 5.54674 8.95335 6.10628L24.0564 13.3314C25.2607 13.9078 25.1699 15.6359 23.9119 16.0816L17.7012 18.2825C17.5885 18.3224 17.4939 18.4012 17.4346 18.5041L14.1679 24.1829C13.5065 25.3329 11.7731 25.1214 11.4093 23.8463L6.85075 7.8544Z" stroke="${color}"/>
      </g>
      <defs>
        <filter id="${filterId}" x="4.28796" y="4.45428" width="23.1241" height="23.9793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4_43"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4_43" result="shape"/>
        </filter>
      </defs>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

export const generateColoredCursorBase64 = (
  color: string,
  userId: string
): string => {
  const filterId = `filter0_d_${userId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const svgString = `
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org2000/svg">
      <g filter="url(#${filterId})">
        <path d="M11.8924 23.7113L7.33378 7.71982C7.0984 6.89409 7.95602 6.18106 8.73584 6.55413L23.8385 13.7792C24.6416 14.1634 24.5812 15.3159 23.7425 15.6131L17.5312 17.8139C17.3056 17.8938 17.1164 18.0511 16.9978 18.2574L13.7318 23.9361C13.2908 24.7029 12.1347 24.5616 11.8924 23.7113Z" fill="${color}"/>
        <path d="M6.85075 7.8544C6.49768 6.61583 7.78362 5.54674 8.95335 6.10628L24.0564 13.3314C25.2607 13.9078 25.1699 15.6359 23.9119 16.0816L17.7012 18.2825C17.5885 18.3224 17.4939 18.4012 17.4346 18.5041L14.1679 24.1829C13.5065 25.3329 11.7731 25.1214 11.4093 23.8463L6.85075 7.8544Z" stroke="${color}"/>
      </g>
      <defs>
        <filter id="${filterId}" x="4.28796" y="4.45428" width="23.1241" height="23.9793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4_43"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4_43" result="shape"/>
        </filter>
      </defs>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

export const USER_POINTER_COLORS = [
  '#DC6803',
  '#039855',
  '#1570EF',
  '#DD2590',
] as const;

export const getUserColor = (userId: string): string => {
  const colors = USER_POINTER_COLORS;
  const colorIndex = Array.from(userId).reduce((sum, char) => {
    return (sum + char.charCodeAt(0)) % colors.length;
  }, 0);
  return colors[colorIndex];
};
