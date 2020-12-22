import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <header>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <br />
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

// Runs once. Calls getStaticProps (therefore also Post) for each item in paths
export async function getStaticPaths() {
  const paths = getAllPostIds() // array of context objects, each with a with params key

  // return an array of possible values for [id]
  return {
    paths,
    fallback: false // false: posts/non-existing-path will result in 404
  }
}

export async function getStaticProps({ params }) { // params property from a context object
  const postData = await getPostData(params.id)

  return {
    props: {
      postData
    }
  }
}
