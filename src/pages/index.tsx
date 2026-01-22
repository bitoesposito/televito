import { useRef } from "react";
import TitleBox from "../components/utility/TitleBox";
import WeatherWidget from "../components/widgets/Weather";
import ContactWidget from "../components/widgets/Contact";
import TvGuideWidget from "../components/widgets/TvGuideWidget";
import EconomicsNewsWidget from "../components/widgets/EconomicsNews";
import CultureNewsWidget from "../components/widgets/CultureNews";
import LastNewsWidget from "../components/widgets/LatestNews";
import { useVisibleWidgets } from "../hooks/useVisibleWidgets";

export default function IndexPage() {
	const widgetsColumnRef = useRef<HTMLDivElement>(null);

	const { visibleWidgets, measurementRef } = useVisibleWidgets({
		widgetCount: 4,
		gap: 12,
		containerRef: widgetsColumnRef as React.RefObject<Element | null>,
	});

	return (
		<div className="flex flex-col gap-3">
			<TitleBox color="blue" title="Benvenuti al televito" size="lg" />

			<div className="flex flex-col flex-1 sm:grid sm:grid-cols-2 gap-3">
				<div className="flex flex-col gap-3 sm:justify-between sm:mb-0 mb-2">
					<ContactWidget />
					<div className="flex flex-col gap-3">
						<WeatherWidget />
					</div>
				</div>

				<div ref={widgetsColumnRef} className="flex flex-col gap-3 relative">
					{/* Container nascosto per misurare le altezze */}
					<div
						ref={measurementRef}
						className="absolute inset-0 pointer-events-none"
						style={{
							visibility: "hidden",
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							zIndex: -1,
						}}
					>
						<div className="flex flex-col gap-3">
							<LastNewsWidget />
							<TvGuideWidget />
							<EconomicsNewsWidget />
							<CultureNewsWidget />
						</div>
					</div>

					{/* Widget visibili */}
					{visibleWidgets[0] && <LastNewsWidget />}
					{visibleWidgets[1] && <TvGuideWidget />}
					{visibleWidgets[2] && <EconomicsNewsWidget />}
					{visibleWidgets[3] && <CultureNewsWidget />}
				</div>
			</div>
		</div>
	);
}
