import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts'

class ChatPromptTemplate_Prompts implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    categoryName: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '聊天提示词模板'
        this.name = 'chatPromptTemplate'
        this.type = '聊天提示词模板'
        this.icon = 'prompt.svg'
        this.category = 'Prompts'
        this.categoryName = '提示词'
        this.description = '聊天提示词模板'
        this.baseClasses = [this.type, ...getBaseClasses(ChatPromptTemplate)]
        this.inputs = [
            {
                label: '系统提示',
                name: 'systemMessagePrompt',
                type: 'string',
                rows: 4,
                placeholder: `你是一个有帮助的助手,可以将{输入语言}翻译成{目标语言}。`
            },
            {
                label: '用户消息',
                name: 'humanMessagePrompt',
                type: 'string',
                rows: 4,
                placeholder: `{text}`
            },
            {
                label: '格式化提示语',
                name: 'promptValues',
                type: 'json',
                optional: true,
                acceptVariable: true,
                list: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const systemMessagePrompt = nodeData.inputs?.systemMessagePrompt as string
        const humanMessagePrompt = nodeData.inputs?.humanMessagePrompt as string
        const promptValuesStr = nodeData.inputs?.promptValues as string

        const prompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessagePrompt),
            HumanMessagePromptTemplate.fromTemplate(humanMessagePrompt)
        ])

        let promptValues: ICommonObject = {}
        if (promptValuesStr) {
            promptValues = JSON.parse(promptValuesStr.replace(/\s/g, ''))
        }
        // @ts-ignore
        prompt.promptValues = promptValues

        return prompt
    }
}

module.exports = { nodeClass: ChatPromptTemplate_Prompts }
