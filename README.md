<h1 align="center">
  <h3 align="center">**NOME_DO_PROJETO**</h4>
  <h4 align="center" style="text-align: center">
      <a href="#getting-started">Introdução</a> •
      <a href="dev/README.md">Dev</a> •
      <a href="docs/GITFLOW.md">Git Flow</a> •
      <a href="docs/RELEASE_NOTES.md">Release Notes</a> •
    </h4>
</h1>
<hr />
<p>&nbsp;</p>

# Introdução

[`Monorepo`](https://en.wikipedia.org/wiki/Monorepo) é uma estratégia de desenvolvimento de software onde o código de muitos projetos é armazenado no mesmo repositório.


Os diretórios principais do projetos estão listados abaixo:

```
.
├── apps   -- Diretorio principal de aplicações;
├── libs   -- Diretorio principal de bibliotecas;
├── dev    -- Ferramentas para desenvolvimento local;
├── deploy -- Manifetos Kubernetes para Deploy;
```

## DEV

Na pasta `dev` você irá encontrar ferramentas que irão auxiliar o desenvolvimento. Clique [`aqui`](dev/README.md) para saber mais.