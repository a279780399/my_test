import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAI, OpenAIInput } from 'langchain/llms/openai'

class OpenAI_LLMs implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    categoryName: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'OpenAI'
        this.name = 'openAI'
        this.type = 'OpenAI'
        this.icon = 'openai.png'
        this.category = 'LLMs'
        this.categoryName = '大型语言模型'
        this.description = 'OpenAI大型语言模型'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAI)]
        this.inputs = [
            {
                label: 'OpenAI Api密钥',
                name: 'openAIApiKey',
                type: 'password'
            },
            {
                label: '模型名称',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'text-davinci-003',
                        name: 'text-davinci-003'
                    },
                    {
                        label: 'text-davinci-002',
                        name: 'text-davinci-002'
                    },
                    {
                        label: 'text-curie-001',
                        name: 'text-curie-001'
                    },
                    {
                        label: 'text-babbage-001',
                        name: 'text-babbage-001'
                    }
                ],
                default: 'text-davinci-003',
                optional: true
            },
            {
                label: '温度',
                name: 'temperature',
                type: 'number',
                default: 0.7,
                optional: true
            },
            {
                label: '最大Token数',
                name: 'maxTokens',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Best Of',
                name: 'bestOf',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '频率惩罚',
                name: 'frequencyPenalty',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '存在惩罚',
                name: 'presencePenalty',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '批量大小',
                name: 'batchSize',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '超时时间',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '基础路径',
                name: 'basepath',
                type: 'string',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const openAIApiKey = nodeData.inputs?.openAIApiKey as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty = nodeData.inputs?.presencePenalty as string
        const timeout = nodeData.inputs?.timeout as string
        const batchSize = nodeData.inputs?.batchSize as string
        const bestOf = nodeData.inputs?.bestOf as string
        const streaming = nodeData.inputs?.streaming as boolean
        const basePath = nodeData.inputs?.basepath as string

        const obj: Partial<OpenAIInput> & { openAIApiKey?: string } = {
            temperature: parseFloat(temperature),
            modelName,
            openAIApiKey,
            streaming: streaming ?? true
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseInt(topP, 10)
        if (frequencyPenalty) obj.frequencyPenalty = parseInt(frequencyPenalty, 10)
        if (presencePenalty) obj.presencePenalty = parseInt(presencePenalty, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)
        if (batchSize) obj.batchSize = parseInt(batchSize, 10)
        if (bestOf) obj.bestOf = parseInt(bestOf, 10)

        const model = new OpenAI(obj, {
            basePath
        })
        return model
    }
}

module.exports = { nodeClass: OpenAI_LLMs }
