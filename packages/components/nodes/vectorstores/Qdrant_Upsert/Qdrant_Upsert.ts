import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { QdrantClient } from '@qdrant/js-client-rest'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'
import { flatten } from 'lodash'

class QdrantUpsert_VectorStores implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    categoryName: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Qdrant 向量更新插入'
        this.name = 'qdrantUpsert'
        this.type = 'Qdrant'
        this.icon = 'qdrant_logo.svg'
        this.category = 'Vector Stores'
        this.categoryName = '向量存储'
        this.description = '将文档向量上传并合并到Qdrant的向量索引中,如果文档已经存在就更新向量,如果不存在就插入新的向量。'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '文档',
                name: 'document',
                type: 'Document',
                list: true
            },
            {
                label: '嵌入向量',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Qdrant URL',
                name: 'qdrantServerUrl',
                type: 'string',
                placeholder: 'http://localhost:6333'
            },
            {
                label: 'Qdrant集合名称',
                name: 'qdrantCollection',
                type: 'string'
            },
            {
                label: 'Qdrant API密钥',
                name: 'qdrantApiKey',
                type: 'password',
                optional: true
            },
            {
                label: 'Top K',
                name: 'topK',
                description: '获取前K个结果,K的默认值为4。',
                placeholder: '4',
                type: 'number',
                additionalParams: true,
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Qdrant 检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Qdrant 向量存储',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(QdrantVectorStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const qdrantServerUrl = nodeData.inputs?.qdrantServerUrl as string
        const collectionName = nodeData.inputs?.qdrantCollection as string
        const qdrantApiKey = nodeData.inputs?.qdrantApiKey as string
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string
        const topK = nodeData.inputs?.topK as string
        const k = topK ? parseInt(topK, 10) : 4

        // connect to Qdrant Cloud
        const client = new QdrantClient({
            url: qdrantServerUrl,
            apiKey: qdrantApiKey
        })

        const flattenDocs = docs && docs.length ? flatten(docs) : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const dbConfig: QdrantLibArgs = {
            client,
            url: qdrantServerUrl,
            collectionName
        }
        const vectorStore = await QdrantVectorStore.fromDocuments(finalDocs, embeddings, dbConfig)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever(k)
            return retriever
        } else if (output === 'vectorStore') {
            ;(vectorStore as any).k = k
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: QdrantUpsert_VectorStores }
