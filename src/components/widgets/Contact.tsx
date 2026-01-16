import TitleBox from "../utility/TitleBox";

export default function ContactWidget() {
  return (
    <div className="h-min">
      <TitleBox color="cyan" title="Chi sono" size="md" className="mb-4" />
      <p className="uppercase" style={{ color: "var(--cyan)" }}>
        Vito Esposito - Frontend Developer
      </p>
      <p className="mb-4" style={{ color: "var(--white)" }}>
        Integrazione tra design e sviluppo per applicazioni web
      </p>

      <TitleBox color="white" title="contatti" size="md" className="mb-4" />

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

      <p className=' opacity-50 my-2 uppercase'>oppure</p>

      
      <div className="flex flex-col">
        <p className="uppercase" style={{ color: "var(--cyan)" }}>
          visita il blog:
        </p>
        <a
            className="uppercase underline"
            style={{ color: "var(--white)" }}
            href="https://blog.vitoesposito.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            blog.vitoesposito.it
          </a>
      </div>
    </div>
  );
}
