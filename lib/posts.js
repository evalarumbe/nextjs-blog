import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts') 

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// called by getStaticPaths once per dynamic route FILE (e.g. pages/posts/[id].js)
export function getAllPostIds() {
  const filenames = fs.readdirSync(postsDirectory)

  /** 
   * Since we want getStaticProps to do something dynamic, we need to pass it some params.
   * 
   * - Return an array of objects. 
   * -- Each obj needs a params property.
   * -- That params property must be an obect.
   * -- The properties of the params object match part of a dynamic route.
   * 
   * Source: https://nextjs.org/learn/basics/dynamic-routes/implement-getstaticpaths
   */

  return filenames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md/, '')
      }
    }
  })
}

// called by getStaticProps once per dynamic route URL (e.g. posts/specific-post-id)
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,                   // id as passed in
    contentHtml,          // content from md, converted into an HTML string
    ...matterResult.data  // metadata from md as ANNNNNNNNN?????
  }
}
