import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { MarkdownTextSplitter, MarkdownTextSplitterParams } from 'langchain/text_splitter'

class MarkdownTextSplitter_TextSplitters implements INode {
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
        this.label = 'Markdown文本切分器'
        this.name = 'markdownTextSplitter'
        this.type = 'Markdown文本切分器'
        this.icon = 'markdownTextSplitter.svg'
        this.category = 'Text Splitters'
        this.categoryName = '文本切分器'
        this.description = `根据Markdown格式文档中的标题,拆分内容成多个文档。`
        this.baseClasses = [this.type, ...getBaseClasses(MarkdownTextSplitter)]
        this.inputs = [
            {
                label: '块大小',
                name: 'chunkSize',
                type: 'number',
                default: 1000,
                optional: true
            },
            {
                label: '块重叠',
                name: 'chunkOverlap',
                type: 'number',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const chunkSize = nodeData.inputs?.chunkSize as string
        const chunkOverlap = nodeData.inputs?.chunkOverlap as string

        const obj = {} as MarkdownTextSplitterParams

        if (chunkSize) obj.chunkSize = parseInt(chunkSize, 10)
        if (chunkOverlap) obj.chunkOverlap = parseInt(chunkOverlap, 10)

        const splitter = new MarkdownTextSplitter(obj)

        return splitter
    }
}

module.exports = { nodeClass: MarkdownTextSplitter_TextSplitters }
