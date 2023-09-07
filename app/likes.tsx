"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";


export default function Likes({ tweet, addOptimisticTweet }: {
    tweet: TweetWithAuthor;
    addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
    const router = useRouter()
    const handleLikes = async () => {
        const supabase = createClientComponentClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            if (tweet.user_has_liked_tweet) {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes - 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet
                });
                await supabase.from('likes').delete().match({
                    user_id: user.id, tweet_id: tweet.id
                })
            } else {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes + 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet
                });
                await supabase.from('likes').insert({ user_id: user.id, tweet_id: tweet.id })
            }

            router.refresh()
        }

    }
    return <button onClick={handleLikes}
        className="group flex item-center pt-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover:fill-green-600
            group-hover:stroke-green-600 
            ${tweet.user_has_liked_tweet
                    ? "fill-green-600 stroke-white"
                    : "fill-none stroke-gray-500"
                }`}
        ><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        <span className={`ml-2 text-sm 
        group-hover:text-green-600
        group-hover: stroke-green-600
        ${tweet.user_has_liked_tweet
                ? "text-green-600"
                : "text-gray-500"
            }`}>{tweet.likes}</span>
    </button>
}
