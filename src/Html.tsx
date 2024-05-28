import { ReactNode } from "react";
import refreshScript from "./refresh-hack.js?raw";

interface HtmlProps {
  children: ReactNode;
}

function Html({ children }: HtmlProps) {
  // inject vite refresh script to avoid "React refresh preamble was not loaded"
  let viteScripts = <></>;
  if (import.meta.env.DEV) {
    viteScripts = (
      <>
        <script type="module" src="/@vite/client" />
        <script
          type="module"
          dangerouslySetInnerHTML={{ __html: refreshScript }}
        />
      </>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        {viteScripts}
        <link rel="shortcut icon" href="/vite.svg" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel='preload'
          href='/src/assets/fonts/Raleway/Raleway-Regular.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Raleway/Raleway-Medium.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Raleway/Raleway-Bold.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Raleway/Raleway-Black.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-Regular.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-Medium.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-SemiBold.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-Bold.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-ExtraBold.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link
          rel='preload'
          href='/src/assets/fonts/Golos/GolosText-Black.ttf'
          as='font'
          type='font/ttf'
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/src/assets/fonts/index.css" />
        <title>Vite + React + SSR + Chakra-UI</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

export default Html;
