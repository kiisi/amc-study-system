export const CircularProgressIcon = () => {

  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 16 17"
      fill="none"
    >
      <path
        d="M10.3866 8.50001C10.3866 9.82001 9.31995 10.8867 7.99995 10.8867C6.67995 10.8867 5.61328 9.82001 5.61328 8.50001C5.61328 7.18001 6.67995 6.11334 7.99995 6.11334C9.31995 6.11334 10.3866 7.18001 10.3866 8.50001Z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.9999 14.0131C10.3532 14.0131 12.5466 12.6265 14.0732 10.2265C14.6732 9.28646 14.6732 7.70646 14.0732 6.76646C12.5466 4.36646 10.3532 2.9798 7.9999 2.9798C5.64656 2.9798 3.45323 4.36646 1.92656 6.76646C1.32656 7.70646 1.32656 9.28646 1.92656 10.2265C3.45323 12.6265 5.64656 14.0131 7.9999 14.0131Z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const EyeSlashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-gray-500"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
      <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  );
};