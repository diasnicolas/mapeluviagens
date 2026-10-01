import { useEffect } from 'react';

/** Friendly error when the JSON can't be loaded */
export function ErrorState({ url, message }: { url: string; message: string }) {
  useEffect(() => {
    document.title = 'Erro ao carregar o site';
  }, []);

  return (
    <main className="load-error" id="load-error">
      <div className="load-error__card" role="alert">
        <span className="load-error__icon">
          <i className="fa-solid fa-plane-slash" aria-hidden="true" />
        </span>
        <h1>Não foi possível carregar as ofertas</h1>
        <p>
          Os dados do site (<code>{url}</code>) não puderam ser lidos.
        </p>
        <p>
          Este site precisa ser servido via <strong>HTTP</strong> — abrir o arquivo diretamente (<code>file://</code>) não
          funciona. Em desenvolvimento, execute <code>npm run dev</code> na pasta do projeto; para publicar, rode{' '}
          <code>npm run build</code> e sirva a pasta <code>dist</code> por um servidor HTTP (ex.: <code>npm run preview</code>).
        </p>
        <p className="load-error__detail">{message}</p>
        <button className="btn btn--accent" type="button" onClick={() => window.location.reload()}>
          <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
