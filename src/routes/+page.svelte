<script lang="ts">
	import {
		FileText,
		BarChart3,
		Calendar,
		FileCheck,
		Laptop,
		Lock,
		BarChart2,
		CheckCircle,
		AlertTriangle,
		Download,
		ExternalLink
	} from '@lucide/svelte';
	import BlurredScreenshot from '$lib/BlurredScreenshot.svelte';

	let formSubmitted = false;
	let formLoading = false;
	let formError = '';
	let activeScreenshot = 0;
	let downloadLinks = {
		mac: '#',
		windows: '#',
		linux: '#'
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
			blurRegions: [
				{ top: '1%', left: '8%', width: '35%', height: '8%' },
				{ top: '25%', left: '10%', width: '80%', height: '45%' }
			]
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
			const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				formSubmitted = true;
				form.reset();
				setTimeout(() => {
					downloadLinks = {
						mac: 'https://github.com/yourusername/stock-plan-companion/releases',
						windows: 'https://github.com/yourusername/stock-plan-companion/releases',
						linux: 'https://github.com/yourusername/stock-plan-companion/releases'
					};
				}, 1000);
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

<div class="min-h-screen w-full bg-white">
	<!-- Navigation -->
	<nav class="border-b border-gray-100">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
			<div class="flex items-center gap-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
					<BarChart3 size={20} class="text-white" />
				</div>
				<span class="text-xl font-semibold text-gray-900">Stock Plan Companion</span>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-600 transition hover:text-gray-900"
				>
					GitHub
				</a>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="section-container mx-auto max-w-7xl py-12 sm:py-20 lg:py-28">
		<div class="grid gap-12 lg:grid-cols-2 lg:gap-8">
			<!-- Left Content -->
			<div class="flex flex-col justify-center animate-fade-in">
				<div class="mb-6 inline-flex w-fit rounded-full bg-blue-50 px-4 py-2">
					<span class="text-sm font-medium text-blue-700">Open source • Desktop app</span>
				</div>

				<h1 class="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
					Simplify Your E*TRADE Stock Plan Records
				</h1>

				<p class="mb-8 text-lg text-gray-600 sm:text-xl">
					An open-source desktop application that helps organize RSU and ESPP records for Indian
					taxpayers.
				</p>

				<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<a href="#register" class="btn-primary"> Register & Download </a>
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-secondary"
					>
						View on GitHub
					</a>
				</div>
			</div>

			<!-- Right Screenshots -->
			<div class="animate-slide-up">
				<div
					class="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
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
		</div>
	</section>

	<!-- Main Content with Sticky Sidebar -->
	<div class="section-container mx-auto max-w-7xl py-12 sm:py-16">
		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Left Column: Main Content -->
			<div class="lg:col-span-2 space-y-16">
				<!-- Features Section -->
				<section>
					<div class="mb-12 text-center sm:mb-16">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
						<p class="text-gray-600">Everything you need for Schedule FA compliance and tax reporting</p>
					</div>

					<div class="grid gap-8 sm:grid-cols-2">
						{#each features as feature, i}
							<div
								class="rounded-lg border-2 bg-white p-6 transition {feature.highlight
									? 'border-red-500 shadow-lg ring-2 ring-red-100 sm:col-span-2'
									: 'border-gray-200 hover:border-blue-200 hover:shadow-md'}"
							>
								<div class="flex items-start gap-4">
									<div class="flex-shrink-0 text-blue-600">
										<svelte:component this={feature.icon} size={32} />
									</div>
									<div class="flex-1">
										{#if feature.highlight}
											<div class="mb-2 inline-flex rounded-full bg-red-100 px-3 py-1">
												<span class="text-xs font-bold text-red-700">PRIMARY FEATURE</span>
											</div>
										{/if}
										<h3 class="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
										<p class="text-sm text-gray-600">{feature.description}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Interactive Screenshots Viewer -->
				<section>
					<div class="mb-12 text-center sm:mb-16">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Explore the App</h2>
						<p class="text-gray-600">Click through the key features and interface</p>
					</div>

					<div class="rounded-xl border border-gray-200 shadow-xl overflow-hidden bg-gray-900">
						<BlurredScreenshot
							src={screenshots[activeScreenshot].src}
							alt={screenshots[activeScreenshot].title}
							blurRegions={screenshots[activeScreenshot].blurRegions || []}
						/>

						<!-- Navigation Overlay -->
						<div class="flex items-center justify-between p-4 gap-3">
							<button
								on:click={prevScreenshot}
								class="bg-white hover:bg-gray-100 rounded-lg p-3 shadow-lg transition flex-1 sm:flex-none"
							>
								← Previous
							</button>
							<div class="text-white text-sm bg-black/50 rounded-lg px-3 py-2">
								{activeScreenshot + 1} of {screenshots.length}
							</div>
							<button
								on:click={nextScreenshot}
								class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition flex-1 sm:flex-none"
							>
								Next →
							</button>
						</div>

						<!-- Thumbnail Gallery -->
						<div class="flex gap-2 overflow-x-auto p-4">
							{#each screenshots as screenshot, i}
								<button
									on:click={() => (activeScreenshot = i)}
									class="flex-shrink-0 rounded-lg border-2 overflow-hidden transition {i ===
									activeScreenshot
										? 'border-blue-600 shadow-md'
										: 'border-gray-600 hover:border-gray-500'}"
								>
									<div class="w-20 h-28 overflow-hidden relative">
										<img
											src={screenshot.src}
											alt={screenshot.title}
											class="w-full h-full object-cover"
										/>
										{#each (screenshot.blurRegions || []) as region}
											<div
												class="absolute"
												style="top: {region.top}; left: {region.left}; width: {region.width}; height: {region.height}; backdrop-filter: blur(6px); border-radius: 0.25rem;"
											/>
										{/each}
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- Info Panel -->
					<div class="mt-6 rounded-lg border border-gray-200 bg-white p-6">
						<h3 class="text-xl font-bold text-gray-900 mb-3">
							{screenshots[activeScreenshot].title}
						</h3>
						<p class="text-gray-600 leading-relaxed">
							{screenshots[activeScreenshot].description}
						</p>
					</div>
				</section>

				<!-- Status Section -->
				<section>
					<div class="mb-12 text-center sm:mb-16">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Current Status</h2>
						<p class="text-gray-600">What's available today and what's coming next</p>
					</div>

					<div class="grid gap-8">
						<div class="rounded-lg border border-green-200 bg-green-50 p-8">
							<h3 class="mb-6 text-xl font-semibold text-gray-900">Available Today</h3>
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<CheckCircle size={20} class="mt-1 text-green-600 flex-shrink-0" />
									<span class="text-gray-700">E*TRADE support</span>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle size={20} class="mt-1 text-green-600 flex-shrink-0" />
									<span class="text-gray-700">RSU & ESPP record management</span>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle size={20} class="mt-1 text-green-600 flex-shrink-0" />
									<span class="text-gray-700">Desktop application</span>
								</li>
								<li class="flex items-start gap-3">
									<CheckCircle size={20} class="mt-1 text-green-600 flex-shrink-0" />
									<span class="text-gray-700">Open source</span>
								</li>
							</ul>
						</div>

						<div class="rounded-lg border border-gray-200 bg-gray-50 p-8">
							<h3 class="mb-6 text-xl font-semibold text-gray-900">Coming Soon</h3>
							<ul class="space-y-3">
								<li class="flex items-start gap-3">
									<span class="text-gray-400">→</span>
									<span class="text-gray-700">Additional broker support</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="text-gray-400">→</span>
									<span class="text-gray-700">Dividend income support</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="text-gray-400">→</span>
									<span class="text-gray-700">Better Schedule FA assistance</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="text-gray-400">→</span>
									<span class="text-gray-700">More tax reports</span>
								</li>
							</ul>
						</div>
					</div>
				</section>

				<!-- Getting Started Section -->
				<section>
					<div class="mb-12 text-center sm:mb-16">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Getting Started in 3 Steps</h2>
						<p class="text-gray-600">Download from E*TRADE and upload to Stock Plan Companion</p>
					</div>

					<div class="grid gap-8 md:grid-cols-3">
						<!-- Step 1 -->
						<div class="flex flex-col">
							<div
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white"
							>
								1
							</div>
							<h3 class="mb-3 text-xl font-semibold text-gray-900">Download Holdings</h3>
							<p class="mb-4 text-gray-600 text-sm leading-relaxed">
								Log into E*TRADE Stock Plan → Holdings tab → Download → Download Expanded. Save the .xlsx
								file.
							</p>
							<div class="mt-auto rounded-lg bg-gray-50 p-3 border border-gray-200">
								<p class="text-xs text-gray-600 font-medium">Current portfolio snapshot</p>
							</div>
						</div>

						<!-- Step 2 -->
						<div class="flex flex-col">
							<div
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white"
							>
								2
							</div>
							<h3 class="mb-3 text-xl font-semibold text-gray-900">Download Benefit History</h3>
							<p class="mb-4 text-gray-600 text-sm leading-relaxed">
								Go to My Account → Benefit History. Click Download → Download Expanded. Save the .xlsx file.
							</p>
							<div class="mt-auto rounded-lg bg-gray-50 p-3 border border-gray-200">
								<p class="text-xs text-gray-600 font-medium">Grants, vests, and sales history</p>
							</div>
						</div>

						<!-- Step 3 -->
						<div class="flex flex-col">
							<div
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white"
							>
								3
							</div>
							<h3 class="mb-3 text-xl font-semibold text-gray-900">Download Gains & Losses</h3>
							<p class="mb-4 text-gray-600 text-sm leading-relaxed">
								My Account → Gains & Losses. Select tax year, click Apply, then Download → Download
								Expanded.
							</p>
							<div class="mt-auto rounded-lg bg-gray-50 p-3 border border-gray-200">
								<p class="text-xs text-gray-600 font-medium">Capital gains tax data</p>
							</div>
						</div>
					</div>

					<!-- Upload Section -->
					<div class="mt-12 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg">
						<div class="grid gap-0 lg:grid-cols-2">
							<!-- Left: Info -->
							<div class="p-8 flex flex-col justify-center">
								<h3 class="mb-3 text-2xl font-bold text-gray-900">Upload to Stock Plan Companion</h3>
								<p class="mb-6 text-gray-600">
									Open the app and drag & drop your downloaded E*TRADE files. The app validates and
									organizes everything automatically.
								</p>
								<ul class="space-y-3 text-sm text-gray-700">
									<li class="flex items-start gap-3">
										<span class="text-blue-600 font-bold">✓</span>
										<span>Files are validated and parsed in order</span>
									</li>
									<li class="flex items-start gap-3">
										<span class="text-blue-600 font-bold">✓</span>
										<span>Data stays private on your computer</span>
									</li>
									<li class="flex items-start gap-3">
										<span class="text-blue-600 font-bold">✓</span>
										<span>Instant access to tax reports and analysis</span>
									</li>
								</ul>
							</div>

							<!-- Right: Screenshot -->
							<div class="bg-gray-50 p-8 flex items-center justify-center">
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
					<div class="rounded-xl border border-gray-200 bg-blue-50 px-8 py-12 sm:px-12">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Why This Project?</h2>
						<p class="max-w-3xl text-lg text-gray-700">
							Managing RSUs and ESPPs for Indian tax reporting can be time-consuming and complex. This
							project aims to simplify record keeping and organization. We handle the paperwork so you can
							focus on what matters.
						</p>
						<p class="mt-4 text-sm text-gray-600">
							<strong>Note:</strong> This is not tax filing software and is not affiliated with E*TRADE or the
							Income Tax Department. Always consult with a qualified tax professional for your specific tax
							situation.
						</p>
					</div>
				</section>

				<!-- Registration Section -->
				<section id="register">
					<div class="mx-auto max-w-2xl text-center">
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Get Started Today</h2>
						<p class="mb-8 text-gray-600">Register to download the latest version</p>

						{#if !formSubmitted}
							<form on:submit|preventDefault={handleFormSubmit} class="space-y-4">
								<input
									type="text"
									name="name"
									placeholder="Your name"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								/>
								<input
									type="email"
									name="email"
									placeholder="Your email"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								/>

								{#if formError}
									<p class="text-sm text-red-600">{formError}</p>
								{/if}

								<button
									type="submit"
									disabled={formLoading}
									class="btn-primary w-full disabled:opacity-50"
								>
									{formLoading ? 'Registering...' : 'Register & Download'}
								</button>
							</form>
						{:else}
							<div class="rounded-lg border border-green-200 bg-green-50 p-8">
								<div class="mb-6 text-center">
									<div class="mb-2 flex justify-center">
										<CheckCircle size={40} class="text-green-600" />
									</div>
									<h3 class="mb-2 text-xl font-semibold text-gray-900">Registration Successful!</h3>
									<p class="text-gray-600">Download your copy for your platform:</p>
								</div>

								<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
									<a href={downloadLinks.mac} class="btn-secondary text-center">
										macOS
									</a>
									<a href={downloadLinks.windows} class="btn-secondary text-center">
										Windows
									</a>
									<a href={downloadLinks.linux} class="btn-secondary text-center">
										Linux
									</a>
								</div>

								<button
									on:click={() => (formSubmitted = false)}
									class="mt-6 text-sm text-blue-600 hover:text-blue-700"
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
						<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Open Source</h2>
						<p class="mb-8 text-lg text-gray-600">
							Stock Plan Companion is hosted on GitHub. Community contributions are welcome!
						</p>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-primary"
						>
							Visit GitHub
						</a>
					</div>
				</section>
			</div>

			<!-- Right Column: Sticky Compliance Sidebar -->
			<div class="lg:col-span-1">
				<div class="compliance-sidebar space-y-6">
					<!-- Critical Compliance Alert -->
					<div class="rounded-xl border-2 border-red-300 bg-gradient-to-b from-red-50 to-orange-50 p-6 sticky top-20">
						<div class="flex gap-3">
							<div class="flex-shrink-0">
								<AlertTriangle size={28} class="text-red-600 mt-0.5" />
							</div>
							<div class="flex-1">
								<h3 class="mb-2 text-lg font-bold text-red-900">Schedule FA Required</h3>
								<p class="mb-3 text-sm text-red-800">
									<strong>November 2025:</strong> IT Department is actively identifying non-disclosure of
									foreign assets.
								</p>
								<p class="mb-3 text-xs text-red-700">
									<strong>Mandatory if you:</strong>
								</p>
								<ul class="mb-3 space-y-1 text-xs text-red-700">
									<li>• Hold RSUs/ESPPs from US companies</li>
									<li>• Have foreign bank accounts</li>
									<li>• Receive foreign income</li>
								</ul>
								<p class="mb-4 text-xs font-semibold text-red-900">
									⚠️ Penalty: Up to 50% + prosecution
								</p>
								<div class="space-y-2">
									<a
										href="https://www.incometax.gov.in/iec/foportal/nudge/nudge-schedule-fa#video"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-700 transition"
									>
										<ExternalLink size={14} />
										IT Guidance
									</a>
									<a
										href="https://economictimes.indiatimes.com/wealth/tax/foreign-income-in-itr-avoid-these-7-disclosure-mistakes-that-can-cost-you-dearly/foreign-tax-credit-why-form-67-and-dtaa-are-important/slideshow/132106260.cms"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center justify-center gap-2 rounded-lg border border-red-600 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
									>
										<ExternalLink size={14} />
										Avoid Mistakes
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Why It's Hard -->
					<div class="rounded-lg border border-orange-200 bg-orange-50 p-6">
						<h4 class="mb-3 font-bold text-orange-900">The Challenge</h4>
						<p class="text-xs text-orange-800 leading-relaxed mb-3">
							Schedule FA requires detailed info for each asset: acquisition date, cost, FMV, exchange rates.
						</p>
						<p class="text-xs text-orange-800 font-semibold">
							Manually compiling this across multiple years is error-prone and time-consuming.
						</p>
					</div>

					<!-- The Solution -->
					<div class="rounded-lg border border-green-200 bg-green-50 p-6">
						<h4 class="mb-3 font-bold text-green-900">The Solution</h4>
						<div class="flex items-center gap-2 mb-2">
							<Download size={16} class="text-green-600" />
							<p class="text-xs font-semibold text-green-800">One-Click CSV Export</p>
						</div>
						<p class="text-xs text-green-700">
							All Schedule FA fields auto-populated from your E*TRADE data.
						</p>
					</div>

					<!-- News Article -->
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
						<div class="mb-3 inline-flex rounded-full bg-blue-100 px-2 py-1">
							<span class="text-xs font-bold text-blue-700">In The News</span>
						</div>
						<h4 class="mb-2 text-sm font-bold text-blue-900">IT Crackdown on Foreign Assets</h4>
						<p class="text-xs text-blue-800 mb-3">
							The Hindu reported IT Department is sending SMS/emails to taxpayers with non-disclosed foreign
							assets, advising revised ITR filing by December 31.
						</p>
						<a
							href="https://www.thehindu.com/business/Economy/income-tax-department-identifies-cases-of-non-disclosure-of-foreign-assets-in-itrs/article70329849.ece"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
						>
							Read Article
							<ExternalLink size={12} />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<footer class="border-t border-gray-100 bg-gray-50">
		<div class="section-container mx-auto max-w-7xl py-12 sm:py-16">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<h4 class="mb-4 font-semibold text-gray-900">Product</h4>
					<ul class="space-y-2">
						<li>
							<a href="https://github.com" class="text-sm text-gray-600 hover:text-gray-900">
								GitHub
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h4 class="mb-4 font-semibold text-gray-900">Legal</h4>
					<ul class="space-y-2">
						<li>
							<a href="#privacy" class="text-sm text-gray-600 hover:text-gray-900">
								Privacy
							</a>
						</li>
						<li>
							<a href="#disclaimer" class="text-sm text-gray-600 hover:text-gray-900">
								Disclaimer
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h4 class="mb-4 font-semibold text-gray-900">Support</h4>
					<ul class="space-y-2">
						<li>
							<a href="mailto:contact@example.com" class="text-sm text-gray-600 hover:text-gray-900">
								Contact
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h4 class="mb-4 font-semibold text-gray-900">Legal Notice</h4>
					<p class="text-xs text-gray-600">
						Not affiliated with E*TRADE or the Income Tax Department.
					</p>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
				<p>&copy; 2024 Stock Plan Companion. Open source under MIT License.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
