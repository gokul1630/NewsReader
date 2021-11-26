/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from '@ant-design/icons'
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Typography,
	Select,
} from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { apiCall } from '../utils/apiCall'

interface IHeaderProps {
	onSearch: (value: any) => void
	BASE_URL: string
	onSubmit: any
	APIKEY: any
}

const Header: FC<IHeaderProps> = ({ onSearch, BASE_URL, onSubmit, APIKEY }) => {
	const [form] = Form.useForm()
	const [openModal, setOpenModal] = useState(false)
	const [sourcesData, setSourceData] = useState([])
	const [categoriesData, setCategoryData] = useState([])
	const sentiment = [
		{ sentiment: 'Positive' },
		{ sentiment: 'Negative' },
		{ sentiment: 'Neutral' },
	]
	const handleCloseModal = () => {
		setOpenModal(false)
		form.resetFields()
	}
	const handleOpenModal = () => {
		setOpenModal(true)
	}
	const getSourceCategories = async () => {
		const sources = await apiCall({
			baseURL: `${BASE_URL}/sources/?x-api-key=${APIKEY}`,
		})
		const categories = await apiCall({
			baseURL: `${BASE_URL}/categories/?x-api-key=${APIKEY}`,
		})
		setSourceData(sources['sources'])
		setCategoryData(categories)
	}
	const handleSubmitForm = (values: any) => {
		const { sentiment, category, source } = values
		if (sentiment && category && source) {
			onSubmit(values)
			handleCloseModal()
		}
	}
	useEffect(() => {
		getSourceCategories()
	}, [])
	return (
		<Card size='small'>
			<Form form={form} onFinish={handleSubmitForm}>
				<Modal
					visible={openModal}
					centered
					footer={[
						<Button key='submit' onClick={handleCloseModal} className='br2'>
							Cancel
						</Button>,
						<Button
							key='back'
							onClick={() => {
								form.submit()
							}}
							className='br2'
							type='primary'>
							Show Results
						</Button>,
					]}>
					<Form.Item
						className='mb3'
						name='source'
						rules={[
							{
								message: 'Please Select Source',
								required: true,
							},
						]}>
						<Select placeholder='Source'>
							{sourcesData &&
								sourcesData.map((data) => (
									<Select.Option key={data['id']} value={data['id']}>
										{data['name']}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item
						className='mb3'
						name='category'
						rules={[
							{
								message: 'Please Select Category',
								required: true,
							},
						]}>
						<Select placeholder='Category'>
							{categoriesData &&
								categoriesData.map((data) => (
									<Select.Option
										key={data['category']}
										value={data['iptc_code']}>
										{data['category']}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item
						name='sentiment'
						rules={[
							{
								message: 'Please Select Sentiment',
								required: true,
							},
						]}>
						<Select placeholder='Sentiment'>
							{sentiment &&
								sentiment.map((data) => (
									<Select.Option key={data.sentiment} value={data.sentiment}>
										{data.sentiment}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
				</Modal>
			</Form>
			<Row align='middle' justify='space-around'>
				<Col className='mt2'>
					<Typography.Text className='b f2'>
						<span className='blue'>News</span>Reader
					</Typography.Text>
				</Col>
				<Row wrap={false}>
					<Input
						onChange={onSearch}
						placeholder='Search Here..'
						prefix={<SearchOutlined />}
						allowClear={true}
					/>

					<Button onClick={handleOpenModal} className='ml2'>
						Advanced Search
					</Button>
				</Row>
			</Row>
		</Card>
	)
}

export default Header
