class Templates {
  public Menu (): string {
    const options = `
   1. CRIAR UMA NOVA TASK
   2. LISTAR TASKS
  `
    return options  
  }
}

export const templates = new Templates()
