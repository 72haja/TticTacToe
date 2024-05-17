import "./responsiveFieldWrapper.css";

type ResponsiveFieldWrapperProps = {
  children: React.ReactNode;
}

export function ResponsiveFieldWrapper(props: ResponsiveFieldWrapperProps) {
  return (
    <div id="square-wrapper" className="w-full h-full flex flex-col gap-5 items-center justify-center ">
      <div id="square">
        {props.children}
      </div>
    </div>
  );
};
