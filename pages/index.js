import Head from 'next/head'
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Oleksandr Balyshyn</title>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="description"
                      content="Oleksandr Balyshyn, Software Engineer, Scala Software Engineer, Software Server Engineer, Platform Engineer"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="origin" href="https://readme.worxbend.com"/>

                <meta name="keywords"
                      content="Oleksandr Balyshyn, Oleksandr, Balyshyn, limpid-kzonix, kzonix, Software, Developer, Java, Scala, Software Engineer, Scala Software Engineer, Software Server Engineer, Platform Engineer"/>
                <meta name="description"
                      content="Oleksandr Balyshyn, Oleksandr, Balyshyn, limpid-kzonix, kzonix, Software, Developer, Java, Scala, Software Engineer, Scala Software Engineer, Software Server Engineer, Platform Engineer"/>

                <meta httpEquiv="content-type" content="text/html;charset=UTF-8"/>
                <meta name="distribution" content="web"/>
                <meta httpEquiv="refresh" content="360"/>
                <meta name="robots" content="index, follow"/>


                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content="@limpid-kzonix"/>
                <meta name="twitter:creator" content="@limpid-kzonix"/>
                <meta property="og:url" content="https://readme.worxbend.com"/>
                <meta property="og:title" content="Oleksandr Balyshyn, Software Engineer"/>
                <meta property="og:image" content="/android-chrome-512x512.png"/>
                <meta property="og:type" content="website"/>
                <meta property="og:description"
                      content="Worked as Software Engineer and Software Architect in projects. For several years worked in the field of e-commerce. Has rich experience in server-side development, building reactive and scalable systems based on microservice architecture."/>

                <meta property="og:title" content="Oleksandr Balyshyn, Software Engineer"/>
                <meta property="og:url" content="https://readme.worxbend.com"/>
                <meta property="og:type" content="website"/>
                <meta property="og:description"
                      content="Worked as Software Engineer and Software Architect in projects. For several years worked in the field of e-commerce. Has rich experience in server-side development, building reactive and scalable systems based on microservice architecture."/>
                <meta property="og:image" content="/android-chrome-512x512.png"/>
            </Head>

            <main>
                <h1 className={styles.title}>
                    Welcome
                </h1>

                <div className={styles.grid}>

                </div>
            </main>

            <footer>

            </footer>

            <style jsx>{`
              main {
                padding: 5rem 0;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }

              footer {
                width: 100%;
                height: 100px;
                border-top: 1px solid #eaeaea;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              footer img {
                margin-left: 0.5rem;
              }

              footer a {
                display: flex;
                justify-content: center;
                align-items: center;
                text-decoration: none;
                color: inherit;
              }

              code {
                background: #fafafa;
                border-radius: 5px;
                padding: 0.75rem;
                font-size: 1.1rem;
                font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
              }
            `}</style>

            <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
              }

              * {
                box-sizing: border-box;
              }
            `}</style>
        </div>
    )
}