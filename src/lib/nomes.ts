/**
 * Nomes fictícios brasileiros para acompanhar o CPF gerado — puramente decorativos,
 * já que o nome não entra no cálculo do dígito verificador (ver cpf.ts).
 */

export const PRIMEIROS_NOMES: readonly string[] = [
  'Alice', 'Alexandre', 'Ana', 'Andressa', 'André', 'Antônio', 'Beatriz', 'Bernardo', 'Bianca',
  'Bruno', 'Caio', 'Camila', 'Carla', 'Carlos', 'Caroline', 'Cauã', 'Cecília', 'Célia', 'Cláudio',
  'Cristiane', 'Daniel', 'Danilo', 'Débora', 'Diego', 'Eduarda', 'Eduardo', 'Elaine', 'Eliane',
  'Emanuel', 'Emanuelle', 'Enzo', 'Érica', 'Fabiana', 'Fábio', 'Felipe', 'Fernanda', 'Fernando',
  'Flávia', 'Francisco', 'Gabriel', 'Gabriela', 'Geovana', 'Giovana', 'Giovanni', 'Gustavo',
  'Heitor', 'Helena', 'Henrique', 'Igor', 'Isabela', 'Isabella', 'Isadora', 'Ivan', 'Ivone',
  'Jamile', 'Janaína', 'João', 'Joaquim', 'Jorge', 'José', 'Josefina', 'Juliana', 'Júlia',
  'Julio', 'Karina', 'Kauê', 'Larissa', 'Laura', 'Lavínia', 'Leandro', 'Leonardo', 'Letícia',
  'Lorena', 'Lucas', 'Luana', 'Luciana', 'Lucimar', 'Luiz', 'Luísa', 'Manuela', 'Marcela',
  'Marcelo', 'Marcos', 'Maria', 'Mariana', 'Mário', 'Matheus', 'Maurício', 'Melissa', 'Michele',
  'Miguel', 'Milena', 'Murilo', 'Natália', 'Nicolas', 'Norberto', 'Otávio', 'Patrícia', 'Paulo',
  'Pedro', 'Priscila', 'Rafael', 'Rafaela', 'Raimundo', 'Raquel', 'Rebeca', 'Renata', 'Renato',
  'Ricardo', 'Roberta', 'Roberto', 'Rodrigo', 'Rogério', 'Rosana', 'Rosângela', 'Sabrina',
  'Samuel', 'Sandra', 'Sara', 'Sérgio', 'Sílvia', 'Simone', 'Sofia', 'Solange', 'Tainá', 'Talita',
  'Tatiane', 'Thales', 'Thiago', 'Valentina', 'Valéria', 'Vanessa', 'Vera', 'Vicente', 'Vinícius',
  'Vitor', 'Vitória', 'Wagner', 'Walter', 'Washington', 'Wesley', 'William', 'Yago', 'Yasmin',
  'Zilda', 'Zeca', 'Aline', 'Amanda', 'Anderson', 'Adriana', 'Adriano', 'Alessandra', 'Alexandra',
  'Alícia', 'Amanda', 'Aparecida', 'Arthur', 'Augusto', 'Bárbara', 'Benício', 'Breno', 'Bruna',
  'Catarina', 'Cauê', 'Célio', 'Clara', 'Cristina', 'Danielle', 'Davi', 'Dayane', 'Denise',
  'Elisa', 'Elisângela', 'Ellen', 'Emília', 'Everton', 'Ezequiel', 'Filipe', 'Franciele',
  'Geraldo', 'Guilherme', 'Helena', 'Hélio', 'Hugo', 'Inês', 'Iris', 'Isaac', 'Ismael', 'Jaqueline',
  'Jean', 'Jéssica', 'João Pedro', 'Jonas', 'Jonathan', 'Kelly', 'Kevin', 'Laís', 'Leila', 'Lia',
  'Lorenzo', 'Luan', 'Luiza', 'Manoel', 'Marina', 'Mateus', 'Milton', 'Moacir', 'Nathalia',
  'Nayara', 'Nelson', 'Otília', 'Paloma', 'Pietro', 'Rayssa', 'Regina', 'Reinaldo', 'Ruan',
  'Samara', 'Sávio', 'Silvana', 'Suellen', 'Tadeu', 'Tereza', 'Thomas', 'Ubirajara', 'Valdir',
  'Viviane', 'Wallace', 'Yuri',
];

export const SOBRENOMES: readonly string[] = [
  'Alves', 'Andrade', 'Aragão', 'Araújo', 'Azevedo', 'Barbosa', 'Barros', 'Batista', 'Bezerra',
  'Borges', 'Braga', 'Brandão', 'Cardoso', 'Carvalho', 'Castro', 'Cavalcante', 'Coelho',
  'Correia', 'Costa', 'Cunha', 'Dantas', 'Dias', 'Duarte', 'Farias', 'Feitosa', 'Fernandes',
  'Ferreira', 'Figueiredo', 'Fonseca', 'Franco', 'Freitas', 'Gomes', 'Gonçalves', 'Guerra',
  'Guimarães', 'Henriques', 'Jesus', 'Lacerda', 'Leal', 'Leite', 'Lima', 'Lopes', 'Machado',
  'Maia', 'Marques', 'Martins', 'Matos', 'Medeiros', 'Melo', 'Mendes', 'Mendonça', 'Miranda',
  'Monteiro', 'Moraes', 'Moreira', 'Moura', 'Nascimento', 'Nery', 'Neves', 'Nogueira', 'Novaes',
  'Nunes', 'Oliveira', 'Pacheco', 'Paiva', 'Peixoto', 'Pereira', 'Pinheiro', 'Pinto', 'Pires',
  'Prado', 'Ramos', 'Reis', 'Ribeiro', 'Rocha', 'Rodrigues', 'Sales', 'Salles', 'Sampaio',
  'Santana', 'Santos', 'Saraiva', 'Silva', 'Silveira', 'Simões', 'Siqueira', 'Soares', 'Sousa',
  'Souza', 'Tavares', 'Teixeira', 'Torres', 'Uchôa', 'Valadares', 'Valente', 'Vargas', 'Vasconcelos',
  'Vaz', 'Vieira', 'Xavier', 'Zambrano', 'Abreu', 'Amaral', 'Amorim', 'Antunes', 'Assis',
  'Bandeira', 'Bittencourt', 'Bonfim', 'Bragança', 'Brito', 'Bueno', 'Caldeira', 'Camargo',
  'Campos', 'Canário', 'Cardim', 'Carneiro', 'Carrasco', 'Casagrande', 'Cerqueira', 'Chaves',
  'Coimbra', 'Cordeiro', 'Corrêa', 'Cortez', 'Crispim', 'Delgado', 'Diniz', 'Domingues',
  'Escobar', 'Esteves', 'Estrela', 'Evangelista', 'Falcão', 'Faria', 'Ferraz', 'Firmino',
  'Fontes', 'Furtado', 'Galvão', 'Garcia', 'Godoy', 'Goulart', 'Guedes', 'Junqueira', 'Lara',
  'Ledo', 'Lemos', 'Lessa', 'Lira', 'Loureiro', 'Luz', 'Macedo', 'Magalhães', 'Malta', 'Marinho',
  'Marreiro', 'Mascarenhas', 'Meireles', 'Meneses', 'Mesquita', 'Miguel', 'Modesto', 'Montenegro',
  'Morais', 'Muniz', 'Napoleão', 'Navarro', 'Nery', 'Neto', 'Nobre', 'Noronha', 'Olimpio',
  'Orsini', 'Osório', 'Pádua', 'Pantoja', 'Passos', 'Paz', 'Peralta', 'Pontes', 'Portela',
  'Prata', 'Quintela', 'Quiroga', 'Raposo', 'Rezende', 'Ribas', 'Rios', 'Roriz', 'Rosa', 'Salgado',
  'Sá', 'Sarmento', 'Sette', 'Sodré', 'Sotero', 'Tanajura', 'Terra', 'Tenório', 'Toledo',
  'Trindade', 'Tristão', 'Uchoa', 'Ulhôa', 'Vale', 'Valle', 'Ventura', 'Viana', 'Vilela', 'Wanderley',
];

function indiceAleatorio(max: number): number {
  return Math.floor(Math.random() * max);
}

/** "Nome Sobrenome" fictício, sem qualquer relação com pessoa real. */
export function gerarNome(): string {
  const primeiro = PRIMEIROS_NOMES[indiceAleatorio(PRIMEIROS_NOMES.length)];
  const sobrenome = SOBRENOMES[indiceAleatorio(SOBRENOMES.length)];
  return `${primeiro} ${sobrenome}`;
}

/** `quantidade` nomes fictícios — podem repetir, ao contrário dos CPFs que acompanham. */
export function gerarNomes(quantidade: number): string[] {
  return Array.from({ length: quantidade }, gerarNome);
}
