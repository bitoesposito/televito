import type { TelevideoColor } from "../../types/televideo"
import TitleBox from "../utility/TitleBox"

export default function Content({title, color, content}: {title: string, color: TelevideoColor, content: string}) {
    return (
        <>
            <TitleBox color={color as TelevideoColor} title={title} size="lg" />
            <p className="mt-4 uppercase" style={{ color: "var(--white)" }}>
                {content}
            </p>
        </>
    )
}