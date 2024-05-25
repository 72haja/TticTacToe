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