import Layout, { siteTitle } from '../components/layout'
import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts' 

/**
 * If you get a 'fs' module not defined error, here's what's up:
 * 
 * getSortedPostsData uses fs.
 * fs does not work in the browser, only on the server.
 * 
 * getStaticProps runs server-side (because 'next' says so),
 * so we have to make sure that server-only code (like getSortedPostsData)
 * is only running inside of getStaticProps.
 * 
 * At build time, the builder will detect that getStaticProps
 * (plus any funcs it's calling) is only being used on the server,
 * so it won't be shipped it to the client. Happy days.
 * 
 * The error shows up:
 * - If we import fs and don't use it
 * - If we import fs and use it in a client-side func (outside getStaticProps)
 */ 

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          (This is a sample website. You'll be building a site like this on{' '}<a href="https://nextjs.org/learn">our Next.js tutorial</a>).
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

/** Fun facts about getStaticProps:
 *  - Designed to prepare all the data needed for a page
 *    so it can only be defined in PAGE files
 * 
 *  - Runs only on the server side
 *    so it CAN access: fs, API endpoints and DB
 * 
 *  - Designed to run only at build time (in prod)
 *    so it CANNOT access: query params, http headers
 * 
 * Source: https://nextjs.org/learn/basics/data-fetching/getstaticprops-details
 */
export async function getStaticProps() {
  const allPostsData = getSortedPostsData()

  return {
    props: {
      allPostsData
    }
  }
}
