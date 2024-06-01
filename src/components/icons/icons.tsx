import { v4 as uuid } from "uuid";

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
}

export function CilCircle(props: IconProps, key: string = uuid()) {
  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
    key={key}
  >
    <path
      fill="currentColor"
      d="M256.6 496A239.364 239.364 0 0 0 425.856 87.379A239.364 239.364 0 0 0 87.344 425.892A237.8 237.8 0 0 0 256.6 496Zm0-446.729c114.341 0 207.365 93.023 207.365 207.364S370.941 464 256.6 464S49.236 370.977 49.236 256.635S142.259 49.271 256.6 49.271Z"
    ></path>
  </svg>
  )
}

export function CilXCircle(props: IconProps, key: string = uuid()) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="m348.071 141.302l-87.763 87.763l-87.763-87.763l-22.628 22.627l87.764 87.763l-87.764 87.764l22.628 22.627l87.763-87.763l87.763 87.763l22.628-22.627l-87.764-87.764l87.764-87.763l-22.628-22.627z"
        key={uuid()}
      ></path>
      <path
        fill="currentColor"
        d="M425.706 86.294A240 240 0 0 0 86.294 425.706A240 240 0 0 0 425.706 86.294ZM256 464c-114.691 0-208-93.309-208-208S141.309 48 256 48s208 93.309 208 208s-93.309 208-208 208Z"
        key={uuid()}
      ></path>
    </svg>
  )
}

export function ShareIcon(props: IconProps, key: string = uuid()) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      key={key}
    >
      <path 
        fill="currentColor"
        d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
        key={uuid()}
      />
    </svg>
  )
}

export function LoadingIcon() {
  return (
    <div className="w-max h-max flex flex-row gap-1">
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce animation-delay-200"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce animation-delay-400"></div>
    </div>
  )
}

export function SettingsIcon(props: IconProps, key: string = uuid()) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        key={uuid()}
      />
    </svg>
  )
}

export function BanIcon(props: IconProps, key: string = uuid()) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
        key={uuid()}
      />
    </svg>
  )
}

export function ShuffleIcon(props: IconProps, key: string = uuid()) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"
        key={uuid()}
      />
    </svg>
  )
}