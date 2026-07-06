<script lang="ts">
	import {
		FileText,
		BarChart3,
		Calendar,
		FileCheck,
		Lock,
		BarChart2,
		CheckCircle,
		AlertTriangle,
		Download,
		ExternalLink,
		Sun,
		Moon,
		Code2,
		ArrowRight,
		TrendingUp
	} from '@lucide/svelte';
	import BlurredScreenshot from '$lib/BlurredScreenshot.svelte';
	import { onMount } from 'svelte';

	// Theme is scoped to this page's wrapper (.spc-v2) so it never touches the
	// rest of the site. Default dark; the wrapper renders with .dark in prerendered
	// HTML, so there's no flash before hydration.
	let theme: 'light' | 'dark' = 'dark';
	onMount(() => {
		try {
			const t = localStorage.getItem('theme-v2');
			if (t === 'light' || t === 'dark') theme = t;
		} catch (e) {
			/* ignore */
		}
	});
	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		try {
			localStorage.setItem('theme-v2', theme);
		} catch (e) {
			/* ignore */
		}
	}

	// Auto-scrolling compliance ticker: native scroll so users can wheel/click;
	// pauses on hover or keyboard focus, seamless loop via duplicated content.
	let tickerEl: HTMLElement;

	onMount(() => {
		const el = tickerEl;
		if (!el) return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const desktop = window.matchMedia('(min-width: 1024px)');
		let paused = false;
		let target = 0;
		let last = performance.now();
		let raf = 0;

		function frame(now: number) {
			const dt = now - last;
			last = now;
			const half = el.scrollHeight / 2; // one copy of the card set
			if (paused || reduceMotion.matches || !desktop.matches || half <= 0) {
				target = el.scrollTop; // stay in sync while the user is in control
			} else {
				target += (30 * dt) / 1000; // ~30px per second
				if (target >= half) target -= half;
				el.scrollTop = target;
			}
			raf = requestAnimationFrame(frame);
		}
		raf = requestAnimationFrame(frame);

		const pause = () => (paused = true);
		const resume = () => (paused = false);
		el.addEventListener('mouseenter', pause);
		el.addEventListener('mouseleave', resume);
		el.addEventListener('focusin', pause);
		el.addEventListener('focusout', resume);

		return () => {
			cancelAnimationFrame(raf);
			el.removeEventListener('mouseenter', pause);
			el.removeEventListener('mouseleave', resume);
			el.removeEventListener('focusin', pause);
			el.removeEventListener('focusout', resume);
		};
	});

	let formSubmitted = false;
	let formLoading = false;
	let formError = '';
	let activeScreenshot = 0;
	let downloadLinks = {
		mac: '#',
		windows: '#'
	};

	const screenshots = [
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2Fea68c3bfb0fa400496e94fad9af4c73b?format=webp&width=800&height=1200',
			title: 'Portfolio View',
			description: 'Complete overview of your RSU and ESPP holdings with real-time values and gains/losses',
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '3%', left: '60%', width: '35%', height: '6%' }
			]
		},
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2F22c302b46d874b8b8722f63024cf092b?format=webp&width=800&height=1200',
			title: 'Tax Centre - Capital Gains',
			description: 'Track capital gains and losses for tax reporting organized by financial year',
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '15%', left: '15%', width: '25%', height: '6%' },
				{ top: '25%', left: '60%', width: '25%', height: '50%' }
			]
		},
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2Ff87c7017d6284956a8ce80d9ceb893c6?format=webp&width=800&height=1200',
			title: 'Tax Centre - Schedule FA',
			description: 'Detailed Schedule FA data for Indian tax reporting with all required fields',
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '20%', left: '10%', width: '80%', height: '60%' }
			]
		},
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2Ff71eef4282dc4009b81e051cd742e999?format=webp&width=800&height=1200',
			title: 'Tax Filing Assistant',
			description: 'Step-by-step guidance for preparing Schedule FA with country and income details',
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '18%', left: '10%', width: '80%', height: '50%' }
			]
		},
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2F7e71c1411bd64f07ab68e317b7ab0db9?format=webp&width=800&height=1200',
			title: 'Sell Advisor',
			description: 'Smart recommendations for optimizing tax outcomes when selling your shares',
			blurRegions: [{ top: '1%', left: '8%', width: '35%', height: '8%' }]
		},
		{
			src: 'https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2F12babee9cf6043bfb764f9e9ec54bd50?format=webp&width=800&height=1200',
			title: 'Benefits History',
			description: 'Complete history of RSU grants, vesting schedules, and ESPP purchases',
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '25%', left: '10%', width: '80%', height: '50%' }
			]
		}
	];

	function nextScreenshot() {
		activeScreenshot = (activeScreenshot + 1) % screenshots.length;
	}

	function prevScreenshot() {
		activeScreenshot = (activeScreenshot - 1 + screenshots.length) % screenshots.length;
	}

	const features = [
		{
			icon: Download,
			title: 'Schedule FA CSV Export',
			description: 'One-click export of all required Schedule FA fields—acquisition dates, costs, FMV, exchange rates',
			highlight: true
		},
		{
			icon: FileText,
			title: 'Import E*TRADE Documents',
			description: 'Easily import your E*TRADE statements and records'
		},
		{
			icon: BarChart2,
			title: 'Track RSUs and ESPPs',
			description: 'Comprehensive tracking of all your stock holdings'
		},
		{
			icon: Calendar,
			title: 'Vesting & Transaction History',
			description: 'Organize vesting schedules and transaction records'
		},
		{
			icon: FileCheck,
			title: 'Capital Gains & Tax Reports',
			description: 'Complete tax documents for Schedule FA, capital gains, and foreign income reporting'
		},
		{
			icon: TrendingUp,
			title: 'Sell Advisor',
			description: 'Lot-level advice on which shares to sell to optimize your tax outcome, with STCG/LTCG impact per lot'
		},
		{
			icon: Lock,
			title: 'Privacy First - No Cloud',
			description: 'Your sensitive data stays on your computer. No uploads, no cloud storage.'
		}
	];

	async function handleFormSubmit(e: Event) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		formLoading = true;
		formError = '';

		try {
			const response = await fetch('https://formspree.io/f/xvzjdkaj', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				formSubmitted = true;
				form.reset();
				// TODO: update these direct-download URLs on EVERY release (new tag + filename).
				// Format: https://github.com/Arthium-Org/stock-plan-companion/releases/download/<tag>/<file>
				downloadLinks = {
					mac: 'https://github.com/Arthium-Org/stock-plan-companion/releases/download/v1.0.0/StockPlanCompanion-1.0.0.dmg',
					windows: 'https://github.com/Arthium-Org/stock-plan-companion/releases/download/v1.0.0/StockPlanCompanion-1.0.0.exe'
				};
			} else {
				formError = 'Failed to submit form. Please try again.';
			}
		} catch (error) {
			formError = 'An error occurred. Please try again.';
		} finally {
			formLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Stock Plan Companion — preview</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="spc-v2 min-h-screen w-full" class:dark={theme === 'dark'}>
	<!-- Navigation -->
	<nav class="nav-blur sticky top-0 z-50">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-xl"
					style="background-image: linear-gradient(135deg, var(--accent), var(--accent-2)); box-shadow: 0 6px 20px -6px var(--accent-glow);"
				>
					<BarChart3 size={18} style="color: var(--on-accent)" />
				</div>
				<span class="text-lg font-semibold tracking-tight t-strong">Stock Plan Companion</span>
			</div>
			<div class="flex items-center gap-2 sm:gap-3">
				<a
					href="https://github.com/Arthium-Org/stock-plan-companion"
					target="_blank"
					rel="noopener noreferrer"
					class="icon-btn"
					aria-label="GitHub"
				>
					<Code2 size={18} />
				</a>
				<button on:click={toggleTheme} class="icon-btn" aria-label="Toggle color theme">
					{#if theme === 'dark'}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
				</button>
				<a href="#register" class="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
					Get the app
				</a>
			</div>
		</div>
	</nav>

	<!-- Hero + Main Content with Sticky Compliance Sidebar -->
	<div class="section-container mx-auto max-w-7xl py-12 sm:py-16 lg:py-20">
		<div class="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
			<!-- Hero (left column, row 1 on desktop) -->
			<div class="min-w-0 lg:col-span-2 lg:col-start-1 lg:row-start-1">
				<section class="animate-fade-in">
					<div class="chip mb-6">
						<span
							class="h-2 w-2 rounded-full"
							style="background: var(--accent); box-shadow: 0 0 10px 1px var(--accent);"
						></span>
						Open source · Desktop app
					</div>

					<h1
						class="mb-6 text-4xl font-bold leading-[1.05] tracking-tight t-strong sm:text-5xl lg:text-6xl"
					>
						Simplify your E*TRADE<br class="hidden sm:block" />
						<span class="gradient-text">stock plan records</span>
					</h1>

					<p class="mb-8 max-w-xl text-lg t-muted sm:text-xl">
						An open-source desktop app that organizes your RSU and ESPP records — and gets you
						Schedule&nbsp;FA ready for Indian tax filing.
					</p>

					<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
						<a href="#register" class="btn-primary">
							Register & Download
							<ArrowRight size={18} />
						</a>
						<a
							href="https://github.com/Arthium-Org/stock-plan-companion"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-secondary"
						>
							<Code2 size={18} />
							View on GitHub
						</a>
					</div>

					<!-- Screenshot below CTA -->
					<div class="mt-14 animate-slide-up">
						<div
							class="card overflow-hidden"
							style="box-shadow: 0 40px 90px -40px var(--accent-glow), 0 20px 50px -30px rgba(0,0,0,0.4);"
						>
							<BlurredScreenshot
								src="https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2Fea68c3bfb0fa400496e94fad9af4c73b?format=webp&width=800&height=1200"
								alt="Stock Plan Companion App - Portfolio View"
								blurRegions={[
									{ top: '1%', left: '8%', width: '35%', height: '8%' },
									{ top: '3%', left: '60%', width: '35%', height: '6%' },
									{ top: '8%', left: '8%', width: '40%', height: '5%' }
								]}
							/>
						</div>
					</div>
				</section>
			</div>

			<!-- Compliance ticker: right column spanning both rows on desktop;
			     stacks directly under the hero on mobile -->
			<div class="min-w-0 lg:col-start-3 lg:row-start-1 lg:row-span-2">
				<div class="compliance-ticker" bind:this={tickerEl}>
					<div class="compliance-ticker-track">
						<div class="contents">{@render complianceCards()}</div>
						<div class="hidden lg:contents" aria-hidden="true">{@render complianceCards()}</div>
					</div>
				</div>
			</div>

			<!-- Main content (left column, row 2 on desktop) -->
			<div class="min-w-0 space-y-24 lg:col-span-2 lg:col-start-1 lg:row-start-2">
				<!-- Features Section -->
				<section>
					<div class="mb-12 text-center">
						<p class="mb-3 text-sm font-semibold uppercase tracking-widest t-accent">How it works</p>
						<h2 class="text-3xl font-bold tracking-tight t-strong sm:text-4xl">
							Built for Schedule FA compliance
						</h2>
						<p class="mt-3 t-muted">Everything you need for tax reporting, on your own machine</p>
					</div>

					<div class="grid gap-5 sm:grid-cols-2">
						{#each features as feature}
							<div
								class="card card-hover p-6 {feature.highlight ? 'sm:col-span-2' : ''}"
								style={feature.highlight
									? 'border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), 0 24px 60px -30px var(--accent-glow);'
									: ''}
							>
								<div class="flex items-start gap-4">
									<div
										class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
										style="background: var(--chip-bg); color: var(--accent-fg);"
									>
										<svelte:component this={feature.icon} size={22} />
									</div>
									<div class="flex-1">
										{#if feature.highlight}
											<div
												class="mb-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
												style="background: var(--chip-bg); color: var(--accent-fg);"
											>
												Primary feature
											</div>
										{/if}
										<h3 class="mb-1.5 text-lg font-semibold t-strong">{feature.title}</h3>
										<p class="text-sm t-muted">{feature.description}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Interactive Screenshots Viewer -->
				<section>
					<div class="mb-12 text-center">
						<p class="mb-3 text-sm font-semibold uppercase tracking-widest t-accent">Product tour</p>
						<h2 class="text-3xl font-bold tracking-tight t-strong sm:text-4xl">Explore the app</h2>
						<p class="mt-3 t-muted">Click through the key features and interface</p>
					</div>

					<div class="card overflow-hidden" style="background: #0b0b10;">
						<BlurredScreenshot
							src={screenshots[activeScreenshot].src}
							alt={screenshots[activeScreenshot].title}
							blurRegions={screenshots[activeScreenshot].blurRegions || []}
						/>

						<!-- Navigation Overlay -->
						<div class="flex items-center justify-between gap-3 p-4">
							<button
								on:click={prevScreenshot}
								class="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 sm:flex-none"
								style="background: rgba(255,255,255,0.08);"
							>
								← Previous
							</button>
							<div class="rounded-lg bg-black/50 px-3 py-2 text-sm text-white/80">
								{activeScreenshot + 1} / {screenshots.length}
							</div>
							<button
								on:click={nextScreenshot}
								class="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:flex-none"
								style="background: var(--accent); color: var(--on-accent);"
							>
								Next →
							</button>
						</div>

						<!-- Thumbnail Gallery -->
						<div class="flex gap-2 overflow-x-auto px-4 pb-4">
							{#each screenshots as screenshot, i}
								<button
									on:click={() => (activeScreenshot = i)}
									class="flex-shrink-0 overflow-hidden rounded-lg border-2 transition"
									style={i === activeScreenshot
										? 'border-color: var(--accent);'
										: 'border-color: rgba(255,255,255,0.12);'}
								>
									<div class="relative h-28 w-20 overflow-hidden">
										<img
											src={screenshot.src}
											alt={screenshot.title}
											class="h-full w-full object-cover"
										/>
										{#each screenshot.blurRegions || [] as region}
											<div
												class="absolute"
												style="top: {region.top}; left: {region.left}; width: {region.width}; height: {region.height}; backdrop-filter: blur(6px); border-radius: 0.25rem;"
											></div>
										{/each}
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- Info Panel -->
					<div class="card mt-5 p-6">
						<h3 class="mb-2 text-xl font-bold t-strong">
							{screenshots[activeScreenshot].title}
						</h3>
						<p class="leading-relaxed t-muted">
							{screenshots[activeScreenshot].description}
						</p>
					</div>
				</section>

				<!-- Status Section -->
				<section>
					<div class="mb-12 text-center">
						<p class="mb-3 text-sm font-semibold uppercase tracking-widest t-accent">Roadmap</p>
						<h2 class="text-3xl font-bold tracking-tight t-strong sm:text-4xl">Current status</h2>
						<p class="mt-3 t-muted">What's available today and what's coming next</p>
					</div>

					<div class="grid gap-5">
						<div
							class="card p-8"
							style="border-color: color-mix(in srgb, var(--success) 40%, var(--border));"
						>
							<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold t-strong">
								<span class="h-2 w-2 rounded-full" style="background: var(--success);"></span>
								Available today
							</h3>
							<ul class="grid gap-3 sm:grid-cols-2">
								{#each ['E*TRADE support', 'RSU & ESPP record management', 'Desktop application', 'Open source'] as item}
									<li class="flex items-start gap-3">
										<CheckCircle size={18} class="mt-0.5 flex-shrink-0" style="color: var(--success)" />
										<span class="t-muted">{item}</span>
									</li>
								{/each}
							</ul>
						</div>

						<div class="card-2 p-8">
							<h3 class="mb-6 text-lg font-semibold t-strong">Coming soon</h3>
							<ul class="grid gap-3 sm:grid-cols-2">
								{#each ['Additional broker support', 'Dividend income support', 'Better Schedule FA assistance', 'More tax reports'] as item}
									<li class="flex items-start gap-3">
										<span class="t-accent">→</span>
										<span class="t-muted">{item}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</section>

				<!-- Getting Started Section -->
				<section>
					<div class="mb-12 text-center">
						<p class="mb-3 text-sm font-semibold uppercase tracking-widest t-accent">Setup</p>
						<h2 class="text-3xl font-bold tracking-tight t-strong sm:text-4xl">
							Getting started in 3 steps
						</h2>
						<p class="mt-3 t-muted">Download from E*TRADE and upload to Stock Plan Companion</p>
					</div>

					<div class="grid gap-5 md:grid-cols-3">
						{#each [{ n: '1', t: 'Download Holdings', d: 'Log into E*TRADE Stock Plan → Holdings tab → Download → Download Expanded. Save the .xlsx file.', c: 'Current portfolio snapshot' }, { n: '2', t: 'Download Benefit History', d: 'Go to My Account → Benefit History. Click Download → Download Expanded. Save the .xlsx file.', c: 'Grants, vests, and sales history' }, { n: '3', t: 'Download Gains & Losses', d: 'My Account → Gains & Losses. Select tax year, click Apply, then Download → Download Expanded.', c: 'Capital gains tax data' }] as step}
							<div class="card flex flex-col p-6">
								<div
									class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold"
									style="background-image: linear-gradient(135deg, var(--accent), var(--accent-2)); color: var(--on-accent); box-shadow: 0 8px 24px -8px var(--accent-glow);"
								>
									{step.n}
								</div>
								<h3 class="mb-2 text-lg font-semibold t-strong">{step.t}</h3>
								<p class="mb-4 text-sm leading-relaxed t-muted">{step.d}</p>
								<div class="card-2 mt-auto p-3">
									<p class="text-xs font-medium t-faint">{step.c}</p>
								</div>
							</div>
						{/each}
					</div>

					<!-- Upload Section -->
					<div class="card mt-8 overflow-hidden">
						<div class="grid gap-0 lg:grid-cols-2">
							<div class="flex flex-col justify-center p-8">
								<h3 class="mb-3 text-2xl font-bold t-strong">Upload to Stock Plan Companion</h3>
								<p class="mb-6 t-muted">
									Open the app and drag & drop your downloaded E*TRADE files. It validates and organizes
									everything automatically.
								</p>
								<ul class="space-y-3 text-sm">
									{#each ['Files are validated and parsed in order', 'Data stays private on your computer', 'Instant access to tax reports and analysis'] as point}
										<li class="flex items-start gap-3">
											<CheckCircle size={18} class="mt-0.5 flex-shrink-0" style="color: var(--accent-fg)" />
											<span class="t-muted">{point}</span>
										</li>
									{/each}
								</ul>
							</div>
							<div class="flex items-center justify-center p-8" style="background: var(--surface-2);">
								<BlurredScreenshot
									src="https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2F4020280870af4ce3bb40ef90ac8dcbfd?format=webp&width=800&height=1200"
									alt="Upload Files Interface"
									blurRegions={[
										{ top: '8%', left: '10%', width: '80%', height: '12%' },
										{ top: '25%', left: '10%', width: '80%', height: '50%' }
									]}
								/>
							</div>
						</div>
					</div>
				</section>

				<!-- Why Section -->
				<section>
					<div
						class="card px-8 py-12 sm:px-12"
						style="background-image: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%);"
					>
						<h2 class="mb-4 text-3xl font-bold tracking-tight t-strong sm:text-4xl">
							Why this project?
						</h2>
						<p class="max-w-3xl text-lg t-muted">
							Managing RSUs and ESPPs for Indian tax reporting is time-consuming and complex. This
							project simplifies record keeping and organization — we handle the paperwork so you can
							focus on what matters.
						</p>
						<p class="mt-4 text-sm t-faint">
							<strong class="t-muted">Note:</strong> This is not tax filing software and is not affiliated
							with E*TRADE or the Income Tax Department. Always consult a qualified tax professional for your
							specific situation.
						</p>
					</div>
				</section>

				<!-- Registration Section -->
				<section id="register">
					<div class="mx-auto max-w-2xl text-center">
						<p class="mb-3 text-sm font-semibold uppercase tracking-widest t-accent">Download</p>
						<h2 class="mb-3 text-3xl font-bold tracking-tight t-strong sm:text-4xl">
							Get started today
						</h2>
						<p class="mb-8 t-muted">Register to download the latest version</p>

						{#if !formSubmitted}
							<form on:submit|preventDefault={handleFormSubmit} class="space-y-4 text-left">
								<input type="text" name="name" placeholder="Your name (optional)" class="input" />
								<input type="email" name="email" placeholder="Your email" required class="input" />

								<label class="flex items-start gap-2 text-sm t-muted">
									<input
										type="checkbox"
										name="consent"
										required
										class="mt-0.5 h-4 w-4 rounded"
										style="accent-color: var(--accent);"
									/>
									<span>Email me about new releases and updates.</span>
								</label>

								{#if formError}
									<p class="text-sm" style="color: var(--danger-fg)">{formError}</p>
								{/if}

								<button type="submit" disabled={formLoading} class="btn-primary w-full disabled:opacity-50">
									{formLoading ? 'Registering...' : 'Register & Download'}
								</button>
							</form>
						{:else}
							<div
								class="card p-8"
								style="border-color: color-mix(in srgb, var(--success) 40%, var(--border));"
							>
								<div class="mb-6 text-center">
									<div class="mb-2 flex justify-center">
										<CheckCircle size={40} style="color: var(--success)" />
									</div>
									<h3 class="mb-2 text-xl font-semibold t-strong">Registration successful!</h3>
									<p class="t-muted">Download your copy for your platform:</p>
								</div>

								<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
									<a href={downloadLinks.mac} download class="btn-secondary text-center">
										Download for macOS
									</a>
									<!-- TODO: enable once the Windows .exe is released
									<a href={downloadLinks.windows} download class="btn-secondary text-center">
										Download for Windows
									</a>
									-->
								</div>

								<button
									on:click={() => (formSubmitted = false)}
									class="mt-6 text-sm font-medium t-accent"
								>
									Register another email
								</button>
							</div>
						{/if}
					</div>
				</section>

				<!-- Open Source Section -->
				<section>
					<div class="text-center">
						<h2 class="mb-4 text-3xl font-bold tracking-tight t-strong sm:text-4xl">Open source</h2>
						<p class="mx-auto mb-8 max-w-lg text-lg t-muted">
							Stock Plan Companion is hosted on GitHub. Community contributions are welcome!
						</p>
						<a
							href="https://github.com/Arthium-Org/stock-plan-companion"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-primary"
						>
							<Code2 size={18} />
							Visit GitHub
						</a>
					</div>
				</section>
			</div>
		</div>
	</div>

	{#snippet complianceCards()}
		<!-- In the News -->
		<div class="card mb-6 p-5">
			<div
				class="mb-3 inline-flex items-center rounded-full px-2.5 py-1"
				style="background: var(--chip-bg);"
			>
				<span class="text-xs font-semibold uppercase tracking-wide t-accent">In the News</span>
			</div>
			<h3 class="mb-2 text-base font-semibold t-strong">IT crackdown on foreign assets</h3>
			<p class="mb-4 text-sm leading-relaxed t-muted">
				The Hindu reports the IT Department is notifying taxpayers with non-disclosed foreign assets
				to file revised ITRs.
			</p>
			<a
				href="https://www.thehindu.com/business/Economy/income-tax-department-identifies-cases-of-non-disclosure-of-foreign-assets-in-itrs/article70329849.ece"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-sm font-medium t-accent"
			>
				Read article
				<ExternalLink size={14} />
			</a>
		</div>

		<!-- IT Department alert -->
		<div class="card mb-6 p-5" style="border-color: var(--danger-border);">
			<div class="mb-3 flex items-center gap-2">
				<AlertTriangle size={20} class="flex-shrink-0" style="color: var(--danger-fg)" />
				<h3 class="text-base font-bold t-strong">Schedule FA is mandatory</h3>
			</div>
			<p class="mb-3 text-sm leading-relaxed t-muted">
				<span class="font-semibold t-strong">Nov 2025:</span> the IT Department is actively identifying
				non-disclosure of foreign assets.
			</p>
			<p class="mb-2 text-sm font-semibold t-strong">You must file it if you:</p>
			<ul class="mb-3 space-y-1.5 text-sm t-muted">
				<li class="flex gap-2">
					<span style="color: var(--danger-fg)">•</span> Hold RSUs/ESPPs from US companies
				</li>
				<li class="flex gap-2">
					<span style="color: var(--danger-fg)">•</span> Have foreign bank accounts
				</li>
				<li class="flex gap-2">
					<span style="color: var(--danger-fg)">•</span> Receive foreign income
				</li>
			</ul>
			<div class="mb-4 rounded-lg px-3 py-2" style="background: var(--danger-bg);">
				<p class="text-xs font-semibold" style="color: var(--danger-fg)">
					Penalty for non-disclosure: up to 50% + prosecution
				</p>
			</div>
			<div class="flex flex-col gap-2">
				<a
					href="https://www.incometax.gov.in/iec/foportal/nudge/nudge-schedule-fa#video"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
					style="background: var(--accent); color: var(--on-accent);"
				>
					<ExternalLink size={14} />
					IT Dept guidance
				</a>
				<a
					href="https://economictimes.indiatimes.com/wealth/tax/foreign-income-in-itr-avoid-these-7-disclosure-mistakes-that-can-cost-you-dearly/foreign-tax-credit-why-form-67-and-dtaa-are-important/slideshow/132106260.cms"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
					style="border: 1px solid var(--border-strong); color: var(--text);"
				>
					<ExternalLink size={14} />
					Avoid common mistakes
				</a>
			</div>
		</div>

		<!-- The Challenge -->
		<div class="card mb-6 p-5">
			<div class="mb-3 flex items-center gap-2">
				<FileText size={20} class="flex-shrink-0 t-faint" />
				<h3 class="text-base font-semibold t-strong">The challenge</h3>
			</div>
			<p class="mb-3 text-sm leading-relaxed t-muted">
				Schedule FA requires detailed data for each asset — acquisition date, cost, fair market value,
				and exchange rates.
			</p>
			<p class="text-sm font-medium t-strong">
				Compiling this by hand across multiple years is error-prone and time-consuming.
			</p>
		</div>

		<!-- The Solution -->
		<div class="card mb-6 p-5">
			<div class="mb-3 flex items-center gap-2">
				<CheckCircle size={20} class="flex-shrink-0" style="color: var(--success)" />
				<h3 class="text-base font-semibold t-strong">The solution</h3>
			</div>
			<div class="mb-2 flex items-center gap-2">
				<Download size={16} class="flex-shrink-0" style="color: var(--accent-fg)" />
				<p class="text-sm font-semibold t-strong">One-click CSV export</p>
			</div>
			<p class="text-sm leading-relaxed t-muted">
				Every Schedule FA field auto-populated from your E*TRADE data.
			</p>
		</div>
	{/snippet}

	<!-- Footer -->
	<footer style="border-top: 1px solid var(--border); background: var(--surface-2);">
		<div class="section-container mx-auto max-w-7xl py-12 sm:py-16">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<div>
					<h4 class="mb-4 font-semibold t-strong">Product</h4>
					<ul class="space-y-2">
						<li>
							<a
								href="https://github.com/Arthium-Org/stock-plan-companion"
								class="text-sm t-muted transition hover:t-accent">GitHub</a
							>
						</li>
					</ul>
				</div>
				<div>
					<h4 class="mb-4 font-semibold t-strong">Support</h4>
					<ul class="space-y-2">
						<li>
							<a href="mailto:kvakatidev@gmail.com" class="text-sm t-muted transition hover:t-accent"
								>Contact</a
							>
						</li>
					</ul>
				</div>
				<div>
					<h4 class="mb-4 font-semibold t-strong">Legal Notice</h4>
					<p class="text-xs t-faint">Not affiliated with E*TRADE or the Income Tax Department.</p>
				</div>
			</div>

			<div class="mt-8 pt-8 text-center text-sm t-faint" style="border-top: 1px solid var(--border);">
				<p>&copy; 2026 Stock Plan Companion. Open source under MIT License.</p>
			</div>
		</div>
	</footer>
</div>
