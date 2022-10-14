import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Octokit } from "@octokit/rest"
const Octokit_fetch_all = Octokit.plugin(require("octokit-fetch-all-repos"));

export async function getServerSideProps({ req, res }) {
  const octokit = new Octokit_fetch_all({
    auth: process.env.GITHUB_TOKEN
  })
  const repos = await octokit.repos.fetchAll({
    owner: "StarNumber12046",
    visibility: "public",
    minimum_access: "admin",
    include_forks: "false",
    include_archived: "true",
    include_templates: "false",
  });
  var old_repos = []
  
  var d = new Date;
  d.setDate(d.getDate() - 100); // about three months (IK 3 months is 90 days)
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  repos.forEach(repo => {
    

    if (Date.parse(repo.updated_at) <= d) {
      old_repos.push({name: repo.name, html_url:repo.html_url, url:repo.url, description:repo.description})
      console.log(repo.name)

    }
  })
  

  return {
    props: {killed_repos: old_repos}, // will be passed to the page component as props
  }


}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Killed by StarNumber</title>
        <meta name="description" content="List of websites killed by StarNumber12046" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.center}>Killed by StarNumber</h1>
      <main className={styles.wrapper}>
        {props.killed_repos.map(((repo) => 
          (<div key="" className={styles.repo}><h2><a href={repo.html_url}>{repo.name}</a></h2>{repo.description || "No description :C"}</div>)
        ))}
      </main>

      <footer className={styles.footer}>
        
      <a href="https://github.com/StarNumber12046">Website generated using stats from GitHub</a>
      </footer>
    </div>
  )
}
