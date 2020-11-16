import '../styles/global.css' // importing applies the styles. that's it.

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
