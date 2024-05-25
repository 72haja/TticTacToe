import packageJson from '../../../package.json';

export function Footer() {

  function routeToPrivacyPolicy(){
    console.log('routeToPrivacyPolicy');
    window.open(window.location.href + "/privacyPolicy", "_blank");
  }

  return (
    <footer className="absolute bottom-0 w-full h-8 bg-gray-800">
      <div className="relative h-full w-full flex justify-center items-center text-white">
        <button
          onClick={routeToPrivacyPolicy}
          className="absolute left-4 bg-transparent hover:underline text-white p-0"
        >
          Privacy Policy
        </button>
        <p className="text-center">T Tic Tac Toe</p>
        <span className="absolute right-4 ">
            v-{packageJson.version}
        </span>
      </div>
    </footer>
  );
}