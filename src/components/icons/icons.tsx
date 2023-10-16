import { QwikIntrinsicElements } from "@builder.io/qwik"

export function CilCircle(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props} key={key}><path fill="currentColor" d="M256.6 496A239.364 239.364 0 0 0 425.856 87.379A239.364 239.364 0 0 0 87.344 425.892A237.8 237.8 0 0 0 256.6 496Zm0-446.729c114.341 0 207.365 93.023 207.365 207.364S370.941 464 256.6 464S49.236 370.977 49.236 256.635S142.259 49.271 256.6 49.271Z"></path></svg>
  )
}

export function CilXCircle(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props} key={key}><path fill="currentColor" d="m348.071 141.302l-87.763 87.763l-87.763-87.763l-22.628 22.627l87.764 87.763l-87.764 87.764l22.628 22.627l87.763-87.763l87.763 87.763l22.628-22.627l-87.764-87.764l87.764-87.763l-22.628-22.627z"></path><path fill="currentColor" d="M425.706 86.294A240 240 0 0 0 86.294 425.706A240 240 0 0 0 425.706 86.294ZM256 464c-114.691 0-208-93.309-208-208S141.309 48 256 48s208 93.309 208 208s-93.309 208-208 208Z"></path></svg>
  )
}