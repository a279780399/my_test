import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { MakeWebhookTool } from './core'

class MakeWebhook_Tools implements INode {
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
        this.label = 'Make.com网络钩子'
        this.name = 'makeWebhook'
        this.type = 'MakeWebhook'
        this.icon = 'make.png'
        this.category = 'Tools'
        this.categoryName = '工具'
        this.description = '在Make.com这个开发平台上,执行网络钩子的调用。'
        this.inputs = [
            {
                label: 'Webhook Url',
                name: 'url',
                type: 'string',
                placeholder: 'https://hook.eu1.make.com/abcdefg'
            },
            {
                label: '工具描述',
                name: 'desc',
                type: 'string',
                rows: 4,
                placeholder: '当需要向Discord发送消息时,可以使用这个功能'
            }
        ]
        this.baseClasses = [this.type, ...getBaseClasses(MakeWebhookTool)]
    }

    async init(nodeData: INodeData): Promise<any> {
        const url = nodeData.inputs?.url as string
        const desc = nodeData.inputs?.desc as string

        return new MakeWebhookTool(url, desc, 'GET')
    }
}

module.exports = { nodeClass: MakeWebhook_Tools }
