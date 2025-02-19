import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { JSONLinesLoader } from 'langchain/document_loaders/fs/json'

class Jsonlines_DocumentLoaders implements INode {
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
        this.label = 'Json Lines文件'
        this.name = 'jsonlinesFile'
        this.type = 'Document'
        this.icon = 'jsonlines.svg'
        this.category = 'Document Loaders'
        this.categoryName = '文档加载器'
        this.description = `加载JSON Lines文件`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Jsonlines文件',
                name: 'jsonlinesFile',
                type: 'file',
                fileType: '.jsonl'
            },
            {
                label: '文本切分器',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: '指针提取',
                name: 'pointerName',
                type: 'string',
                placeholder: '输入指针名称',
                optional: false
            },
            {
                label: '元数据',
                name: 'metadata',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const jsonLinesFileBase64 = nodeData.inputs?.jsonlinesFile as string
        const pointerName = nodeData.inputs?.pointerName as string
        const metadata = nodeData.inputs?.metadata

        let alldocs = []
        let files: string[] = []

        let pointer = '/' + pointerName.trim()

        if (jsonLinesFileBase64.startsWith('[') && jsonLinesFileBase64.endsWith(']')) {
            files = JSON.parse(jsonLinesFileBase64)
        } else {
            files = [jsonLinesFileBase64]
        }

        for (const file of files) {
            const splitDataURI = file.split(',')
            splitDataURI.pop()
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
            const blob = new Blob([bf])
            const loader = new JSONLinesLoader(blob, pointer)

            if (textSplitter) {
                const docs = await loader.loadAndSplit(textSplitter)
                alldocs.push(...docs)
            } else {
                const docs = await loader.load()
                alldocs.push(...docs)
            }
        }

        if (metadata) {
            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata)
            let finaldocs = []
            for (const doc of alldocs) {
                const newdoc = {
                    ...doc,
                    metadata: {
                        ...doc.metadata,
                        ...parsedMetadata
                    }
                }
                finaldocs.push(newdoc)
            }
            return finaldocs
        }

        return alldocs
    }
}

module.exports = { nodeClass: Jsonlines_DocumentLoaders }
