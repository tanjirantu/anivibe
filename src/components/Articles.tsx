"use client";

// import dynamic from "next/dynamic";

// Dynamically import the Canvas component with no SSR
// const Canvas = dynamic(
// 	() => import("@react-three/fiber").then((mod) => mod.Canvas),
// 	{
// 		ssr: false,
// 	}
// );

// Dynamically import the YWingFighter component
// const YWingFighter = dynamic(
// 	() => import("./YWingFighter").then((mod) => mod.YWingFighter),
// 	{
// 		ssr: false,
// 	}
// );

// Dynamically import the OrbitControls component
// const OrbitControls = dynamic(
// 	() => import("@react-three/drei").then((mod) => mod.OrbitControls),
// 	{
// 		ssr: false,
// 	}
// );

// interface Article {
// 	id: number;
// 	title: string;
// 	description: string;
// 	date: string;
// 	tags: string[];
// 	image: string;
// }

// const starWarsArticles: Article[] = [
// 	{
// 		id: 1,
// 		title: "The Art of Lightsaber Combat",
// 		description:
// 			"Discover the ancient techniques and forms of lightsaber combat practiced by Jedi and Sith throughout the ages.",
// 		date: "2024-03-15",
// 		tags: ["Jedi", "Combat", "Lightsaber"],
// 		image: "https://disneyartonmain.com/cdn/shop/files/HangInThere_StarWars.webp?v=1742947488&width=1500",
// 	},
// 	{
// 		id: 2,
// 		title: "The Rise of the Droid Revolution",
// 		description:
// 			"Explore the evolution of droids in the Star Wars universe, from simple protocol units to advanced battle machines.",
// 		date: "2024-03-10",
// 		tags: ["Droids", "Technology", "History"],
// 		image: "https://disneyartonmain.com/cdn/shop/files/DroidsForSale_StarWars.webp?v=1738888892&width=1500",
// 	},
// 	{
// 		id: 3,
// 		title: "Spaceports of the Outer Rim",
// 		description:
// 			"Journey through the most famous spaceports in the galaxy, from Mos Eisley to Cloud City and beyond.",
// 		date: "2024-03-05",
// 		tags: ["Spaceports", "Galaxy", "Travel"],
// 		image: "https://disneyartonmain.com/cdn/shop/files/SpaceportHangar_SW.webp?v=1738540231&width=1500",
// 	},
// ];

export function Articles() {
	return (
		<section className="bg-black dark:bg-gray-900 transition-colors duration-200 relative">
			<div className="absolute inset-0 bg-[url('/assets/starwars_desert.jpg')] bg-cover bg-center opacity-20"></div>
			<div className="relative z-10 h-full w-full">
				{/* <div className="h-full w-full relative">
					<Suspense
						fallback={
							<div className="w-full h-full bg-gray-800 animate-pulse" />
						}
					>
						<Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
							<ambientLight intensity={0.5} />
							<directionalLight
								position={[10, 10, 5]}
								intensity={1}
							/>
							<YWingFighter />
							<OrbitControls
								enableZoom={false}
								enablePan={false}
							/>
						</Canvas>
					</Suspense>
				</div> */}
				{/* <h2 className="text-2xl font-bold text-yellow-400 dark:text-yellow-400 mb-6 font-star-wars">
					Star Wars Chronicles
				</h2> */}
				{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{starWarsArticles.map((article) => (
						<article
							key={article.id}
							className="bg-gray-900 dark:bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40"
						>
							<div className="relative">
								<img
									src={article.image}
									alt={article.title}
									className="w-full h-40 object-cover brightness-75"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
							</div>
							<div className="p-4">
								<div className="flex gap-2 mb-3">
									{article.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs border border-yellow-500/20"
										>
											{tag}
										</span>
									))}
								</div>
								<h3 className="text-lg font-bold text-yellow-400 mb-2 font-star-wars">
									{article.title}
								</h3>
								<p className="text-gray-300 dark:text-gray-400 text-sm mb-3">
									{article.description}
								</p>
								<div className="flex justify-between items-center">
									<span className="text-gray-400 dark:text-gray-500 text-xs">
										{article.date}
									</span>
									<HyperJump>
										<button className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-star-wars">
											Read More →
										</button>
									</HyperJump>
								</div>
							</div>
						</article>
					))}
				</div> */}
			</div>
		</section>
	);
}
