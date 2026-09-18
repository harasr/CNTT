export function VideoClarityFilter() {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none opacity-0 select-none" aria-hidden="true">
      <defs>
        {/* Unsharp Masking Kernel for Video Clarity & Edge Enhancement */}
        <filter id="video-ultra-sharp" x="-5%" y="-5%" width="110%" height="110%">
          <feConvolveMatrix
            order="3"
            preserveAlpha="true"
            divisor="1"
            bias="0"
            kernelMatrix="
               0   -0.3    0
             -0.3   2.2  -0.3
               0   -0.3    0"
          />
        </filter>

        {/* Gentle Clarity Filter for high-bitrate video */}
        <filter id="video-clarity-gentle" x="-5%" y="-5%" width="110%" height="110%">
          <feConvolveMatrix
            order="3"
            preserveAlpha="true"
            divisor="1"
            bias="0"
            kernelMatrix="
               0   -0.18   0
             -0.18  1.72 -0.18
               0   -0.18   0"
          />
        </filter>
      </defs>
    </svg>
  );
}
