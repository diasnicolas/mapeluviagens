/* Complete schema of agencia-viagens.json — every field optional (templates must survive partial data). */

export type Maybe<T> = T | null | undefined;
export type List<T> = Maybe<ReadonlyArray<Maybe<T>>>;

export interface LinkCta {
  texto?: Maybe<string>;
  link?: Maybe<string>;
  icone?: Maybe<string>;
}

export interface Logotipo {
  principal?: Maybe<string>;
  branco?: Maybe<string>;
  icone?: Maybe<string>;
  favicon?: Maybe<string>;
  alt?: Maybe<string>;
}

export interface IdentidadeVisual {
  cor_primaria?: Maybe<string>;
  cor_secundaria?: Maybe<string>;
  cor_destaque?: Maybe<string>;
  cor_escura?: Maybe<string>;
  cor_clara?: Maybe<string>;
  fonte_titulos?: Maybe<string>;
  fonte_textos?: Maybe<string>;
}

export interface AgenciaInfo {
  nome?: Maybe<string>;
  nome_curto?: Maybe<string>;
  slogan?: Maybe<string>;
  descricao_curta?: Maybe<string>;
  ano_fundacao?: Maybe<number | string>;
  cnpj?: Maybe<string>;
  cadastur?: Maybe<string>;
  logotipo?: Maybe<Logotipo>;
  identidade_visual?: Maybe<IdentidadeVisual>;
}

export interface Seo {
  titulo?: Maybe<string>;
  descricao?: Maybe<string>;
  palavras_chave?: List<string>;
  imagem_compartilhamento?: Maybe<string>;
}

export interface MenuItem {
  rotulo?: Maybe<string>;
  ancora?: Maybe<string>;
}

export type CampoBuscaTipo = 'text' | 'date' | 'select' | (string & {});

export interface CampoBusca {
  nome?: Maybe<string>;
  rotulo?: Maybe<string>;
  placeholder?: Maybe<string>;
  tipo?: Maybe<CampoBuscaTipo>;
  opcoes?: List<string>;
}

export interface Busca {
  ativo?: Maybe<boolean>;
  campos?: List<CampoBusca>;
  botao?: Maybe<string>;
}

export interface HeroSlide {
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  imagem?: Maybe<string>;
}

export interface Estatistica {
  valor?: Maybe<string | number>;
  rotulo?: Maybe<string>;
}

export interface Hero {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  titulo_destaque?: Maybe<string>;
  subtitulo?: Maybe<string>;
  imagem_fundo?: Maybe<string>;
  video_fundo?: Maybe<string>;
  overlay_opacidade?: Maybe<number>;
  cta_primario?: Maybe<LinkCta>;
  cta_secundario?: Maybe<LinkCta>;
  slides?: List<HeroSlide>;
  busca?: Maybe<Busca>;
  estatisticas?: List<Estatistica>;
}

export interface SeloExperiencia {
  valor?: Maybe<string | number>;
  rotulo?: Maybe<string>;
}

export interface Numero {
  valor?: Maybe<number | string>;
  sufixo?: Maybe<string>;
  rotulo?: Maybe<string>;
}

export interface MembroEquipe {
  nome?: Maybe<string>;
  cargo?: Maybe<string>;
  especialidade?: Maybe<string>;
  foto?: Maybe<string>;
}

export interface Sobre {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  paragrafos?: List<string>;
  imagem_principal?: Maybe<string>;
  imagem_secundaria?: Maybe<string>;
  selo_experiencia?: Maybe<SeloExperiencia>;
  missao?: Maybe<string>;
  visao?: Maybe<string>;
  valores?: List<string>;
  numeros?: List<Numero>;
  equipe?: List<MembroEquipe>;
  cta?: Maybe<LinkCta>;
}

export interface ItemIcone {
  icone?: Maybe<string>;
  titulo?: Maybe<string>;
  descricao?: Maybe<string>;
}

export interface Diferenciais {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  imagem?: Maybe<string>;
  itens?: List<ItemIcone>;
}

export interface Servico {
  id?: Maybe<string>;
  icone?: Maybe<string>;
  titulo?: Maybe<string>;
  descricao?: Maybe<string>;
  imagem?: Maybe<string>;
  beneficios?: List<string>;
  cta?: Maybe<LinkCta>;
}

export interface Servicos {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  itens?: List<Servico>;
  servicos_complementares?: List<ItemIcone>;
}

export interface Destino {
  destino?: Maybe<string>;
  titulo?: Maybe<string>;
  imagem?: Maybe<string>;
  duracao?: Maybe<string>;
  inclusos?: List<string>;
  preco_de?: Maybe<string | number>;
  preco_por?: Maybe<string | number>;
  parcelamento?: Maybe<string>;
  etiqueta?: Maybe<string>;
  avaliacao?: Maybe<number>;
}

export interface DestinosDestaque {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  itens?: List<Destino>;
}

export interface Depoimento {
  nome?: Maybe<string>;
  cidade?: Maybe<string>;
  foto?: Maybe<string>;
  avaliacao?: Maybe<number>;
  viagem?: Maybe<string>;
  data?: Maybe<string>;
  texto?: Maybe<string>;
}

export interface Depoimentos {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  media_avaliacao?: Maybe<number>;
  total_avaliacoes?: Maybe<number>;
  fonte?: Maybe<string>;
  itens?: List<Depoimento>;
}

export interface Foto {
  url?: Maybe<string>;
  miniatura?: Maybe<string>;
  titulo?: Maybe<string>;
  local?: Maybe<string>;
  categoria?: Maybe<string>;
  alt?: Maybe<string>;
}

export interface Galeria {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  categorias?: List<string>;
  fotos?: List<Foto>;
}

export interface FaqItem {
  pergunta?: Maybe<string>;
  resposta?: Maybe<string>;
}

export interface Faq {
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  itens?: List<FaqItem>;
}

export interface CtaFinal {
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  imagem_fundo?: Maybe<string>;
  botao?: Maybe<LinkCta>;
}

export interface Newsletter {
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  placeholder?: Maybe<string>;
  botao?: Maybe<string>;
}

export interface CanalExibicao {
  exibicao?: Maybe<string>;
  link?: Maybe<string>;
}

export interface WhatsApp extends CanalExibicao {
  numero?: Maybe<string>;
  mensagem_padrao?: Maybe<string>;
}

export interface EmailDepartamento {
  setor?: Maybe<string>;
  email?: Maybe<string>;
}

export interface Horario {
  dias?: Maybe<string>;
  horario?: Maybe<string>;
}

export type CampoFormTipo = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'date' | (string & {});

export interface CampoFormulario {
  nome?: Maybe<string>;
  rotulo?: Maybe<string>;
  tipo?: Maybe<CampoFormTipo>;
  obrigatorio?: Maybe<boolean>;
  placeholder?: Maybe<string>;
  opcoes?: List<string>;
}

export interface Formulario {
  titulo?: Maybe<string>;
  campos?: List<CampoFormulario>;
  botao?: Maybe<string>;
  mensagem_sucesso?: Maybe<string>;
  aviso_privacidade?: Maybe<string>;
}

export interface Mapa {
  latitude?: Maybe<number>;
  longitude?: Maybe<number>;
  embed_url?: Maybe<string>;
  link?: Maybe<string>;
}

export interface Contato {
  etiqueta?: Maybe<string>;
  titulo?: Maybe<string>;
  subtitulo?: Maybe<string>;
  telefone?: Maybe<CanalExibicao>;
  whatsapp?: Maybe<WhatsApp>;
  email?: Maybe<CanalExibicao>;
  emails_departamentos?: List<EmailDepartamento>;
  horario_atendimento?: List<Horario>;
  formulario?: Maybe<Formulario>;
  mapa?: Maybe<Mapa>;
}

export interface RedeSocial {
  nome?: Maybe<string>;
  usuario?: Maybe<string>;
  url?: Maybe<string>;
  icone?: Maybe<string>;
  seguidores?: Maybe<string | number>;
}

export interface Endereco {
  logradouro?: Maybe<string>;
  numero?: Maybe<string>;
  complemento?: Maybe<string>;
  bairro?: Maybe<string>;
  cidade?: Maybe<string>;
  estado?: Maybe<string>;
  uf?: Maybe<string>;
  cep?: Maybe<string>;
  pais?: Maybe<string>;
  referencia?: Maybe<string>;
  completo?: Maybe<string>;
}

export interface LinkRodape {
  rotulo?: Maybe<string>;
  link?: Maybe<string>;
}

export interface Selo {
  nome?: Maybe<string>;
  descricao?: Maybe<string>;
}

export interface Rodape {
  sobre?: Maybe<string>;
  links_rapidos?: List<LinkRodape>;
  links_legais?: List<LinkRodape>;
  formas_pagamento?: List<string>;
  selos?: List<Selo>;
  copyright?: Maybe<string>;
  aviso_demo?: Maybe<string>;
}

export interface AgencyData {
  agencia?: Maybe<AgenciaInfo>;
  seo?: Maybe<Seo>;
  menu?: List<MenuItem>;
  hero?: Maybe<Hero>;
  sobre?: Maybe<Sobre>;
  diferenciais?: Maybe<Diferenciais>;
  servicos?: Maybe<Servicos>;
  destinos_destaque?: Maybe<DestinosDestaque>;
  depoimentos?: Maybe<Depoimentos>;
  galeria?: Maybe<Galeria>;
  faq?: Maybe<Faq>;
  cta_final?: Maybe<CtaFinal>;
  newsletter?: Maybe<Newsletter>;
  contato?: Maybe<Contato>;
  redes_sociais?: List<RedeSocial>;
  endereco?: Maybe<Endereco>;
  rodape?: Maybe<Rodape>;
}
