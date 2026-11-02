// Estrutura da seção Serviços, na ordem de services.items nos dicionários (i18n/dictionaries). Criação de sites vem
// primeiro: é o serviço principal para novos clientes; UX/UI e produto são a base que diferencia esse trabalho.
// `link` leva à página do serviço, quando existe.
export const services = [
  { number: "01", preview: "/services/website.svg", link: "sites" },
  { number: "02", preview: "/services/ux.svg" },
  { number: "03", preview: "/services/product.svg" },
  { number: "04", preview: "/services/system.svg" },
] as const;
