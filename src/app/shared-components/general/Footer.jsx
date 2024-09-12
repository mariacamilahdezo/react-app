export function Footer({ brandName, brandLink, routes }) {
	const year = new Date().getFullYear();

	return (
		<footer className="py-2">
			<div className="flex w-full flex-wrap items-center justify-between gap-20 px-2 md:justify-between">
				<div className="flex items-center">
					<img
						className="logo-icon h-40"
						src="assets/images/logo/pymtech/logo_pymtech_C_white_removebg.png"
						alt="logo"
					/>
					<p className="text-sm">S.A.S</p>
				</div>
				<div className="ml-auto">
					<p className="text-sm">All credits reserved {year}</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
