class Templates {
  public Menu (name: string): string {
    const options = `
   Olá *${name}*! O que deseja?\n
   1. CRIAR UMA NOVA TASK
   2. LISTAR TASKS
  `
    return options  
  }

  public createTaskName (): string {
    const message = `
    *Legal!!*\nQual o nome da task?`
    return message
  }

  public createTaskDate (): string {
    const message = `
    Agora digite a data que você irá receber o lembrete.\n
    Digite no formato *AAAA/MM/DD*.
    `
    return message
  }

  public createRecurringAsk (): string {
    const message = `
    Essa tarefa é recorrente? Ou seja, você quer receber lembretes todos os meses?
    `
    return message
  }

  public createRecurringEnd (): string {
    const message = `
    Beleza!!\n
    Agora insira a data em que esse lembrete não será mais enviado...\n
    Lembrando que o formato deve ser *AAAA/MM/DD*.
    `
    return message
  }

  public createTaskSuccess (): string {
    const message = `
    Sua task foi criada.
    Agora você pode acompanhar no painel do Notion e irá receber uma mensagem na data selecionada.
    Você deseja criar uma nova task?\n
    1. Sim
    2. Não
    `
    return message
  }

  public createTaskError (): string {
    const message = `Houve um erro ao criar sua task.`
    return message
  }

  public listTasks (listOfTasks: string): string {
    const message = `Segue a sua lista de tasks...\n${listOfTasks}`
    return message
  }

  public endTaskCreation (): string {
    const message = `
    *Beleza!!*\nTudo certo aqui.\nCriação finalizada!
    `
    return message
  }
}

export default Templates
