import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.scss'

const { BLOG_URL, CONTENT_API_KEY } = process.env

async function getPost(slug: string) {
	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=slug,title,html,created_at`
	).then((res) => res.json())

	const posts = res.posts

	return posts[0]
}

export const getStaticProps = async ({ params }) => {
	const post = await getPost(params.slug)

	return {
		props: { post },
	}
}

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: true,
	}
}

type Post = {
	title: string
	slug: string
	html: string
}

const Post: React.FC<{ post: Post }> = (props) => {
	const { post } = props
	const router = useRouter()

	if (router.isFallback) {
		return <h1>Loading...</h1>
	}

	return (
		<div className={styles.container}>
			<Link href="/">
				{/* <a>Back</a> */}
				Back
			</Link>
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.html }}></div>
		</div>
	)
}

export default Post
