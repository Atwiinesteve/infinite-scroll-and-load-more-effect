import React, { useEffect } from "react";
import { todo } from "./types/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import "./App.css";

function App() {
	const { ref, inView } = useInView();
	const fetchData = async ({ pageParam }: { pageParam: number }) => {
		const response = await fetch(
			`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`,
		);
		const posts = await response.json();
		return posts;
	};

	const {
		data,
		status,
		error,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["posts"],
		queryFn: fetchData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
	});

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (status === "pending") return <p>Loading...</p>;

	if (status === "error") return <p>Error: {error.message}</p>;

	const content = data?.pages.map((posts: todo[]) =>
		posts.map((post, index) => {
			if (posts.length == index + 1) {
				return (
					<div ref={ref} key={post.id} className="post_body">
						<p className="post_title">{post.title}</p>
					</div>
				);
			} else {
				return (
					<div key={post.id} className="post_body">
						<p className="post_title">{post.title}</p>
					</div>
				);
			}
		}),
	);

	return (
		<>
			<div>
				{content}
				{/* <button
					disabled={!hasNextPage || isFetchingNextPage}
					onClick={() => fetchNextPage()}>
					{isFetchingNextPage
						? "Loading more ..."
						: hasNextPage
						? "Load More"
						: "Nothing more to load"}
				</button> */}
				{isFetchingNextPage ? "Loading more ..." : "No more data to load."}
			</div>
		</>
	);
}

export default App;
