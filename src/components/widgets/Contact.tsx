import TitleBox from "../utility/TitleBox";

export default function ContactWidget() {
  return (
    <div className="h-min">
      <TitleBox color="cyan" title="Chi sono" size="md" className="mb-2" />
      <p className="uppercase" style={{ color: "var(--white)" }}>
        Vito Esposito - ux engineer
      </p>
      <p className="uppercase opacity-50" style={{ color: "var(--white)" }}>
        integrazione tra design e sviluppo per applicazioni web
      </p>

      <TitleBox color="white" title="contatti" size="md" className="my-2" />

      {/* email */}
      <div className="flex gap-3">
        <p className="uppercase w-[4rem]" style={{ color: "var(--cyan)" }}>
          email:
        </p>
        <a
          className="uppercase underline"
          style={{ color: "var(--white)" }}
          href="mailto:vito.esposito@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          info@vitoesposito.it
        </a>
      </div>
      {/* social */}
      <div className="flex gap-3">
        <p className="uppercase w-[4rem]" style={{ color: "var(--cyan)" }}>
          social:
        </p>
        <div className="flex gap-3">
          <a
            className="uppercase underline"
            style={{ color: "var(--white)" }}
            href="https://www.linkedin.com/in/vitoespo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="uppercase underline"
            style={{ color: "var(--white)" }}
            href="https://github.com/bitoesposito"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>

      <TitleBox
        onClick={() => window.open("https://blog.vitoesposito.it", "_blank")}
        color="yellow"
        title="vai al portfolio >>"
        size="lg"
        className="cursor-pointer mt-4 mb-2"
        centerText={true}
      />
    </div>
  );
}
