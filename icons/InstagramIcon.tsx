import { SVGProps } from 'react';

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      fill="url(#a)"
      d="M19 38.47c10.493 0 19-8.507 19-19 0-10.494-8.507-19-19-19s-19 8.506-19 19c0 10.493 8.507 19 19 19Z"
    />
    <path
      fill="#fff"
      d="M22.84 9.97h-7.68a5.667 5.667 0 0 0-5.66 5.66v7.68a5.667 5.667 0 0 0 5.66 5.66h7.68a5.665 5.665 0 0 0 5.66-5.66v-7.68a5.667 5.667 0 0 0-5.66-5.66Zm3.75 13.34a3.75 3.75 0 0 1-3.75 3.75h-7.68a3.75 3.75 0 0 1-3.75-3.75v-7.68a3.75 3.75 0 0 1 3.75-3.75h7.68a3.75 3.75 0 0 1 3.75 3.75v7.68Z"
    />
    <path
      fill="#fff"
      d="M19 14.557a4.915 4.915 0 1 0-.005 9.83 4.915 4.915 0 0 0 .005-9.83Zm0 7.912a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM23.942 15.772a1.215 1.215 0 1 0 0-2.43 1.215 1.215 0 0 0 0 2.43Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={19}
        x2={19}
        y1={38.294}
        y2={3.044}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E09B3D" />
        <stop offset={0.24} stopColor="#C74C4D" />
        <stop offset={0.65} stopColor="#C21975" />
        <stop offset={1} stopColor="#7024C4" />
      </linearGradient>
    </defs>
  </svg>
);
export default InstagramIcon;
