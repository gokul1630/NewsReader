/* eslint-disable react-hooks/exhaustive-deps */
import { DoubleRightOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Divider, Row } from 'antd'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import './style.css'
import { apiCall } from './utils/apiCall'
function App() {
	const [newsData, setNewsData] = useState([])
	const [nextPageUrl, setNextPageUrl] = useState('')
	const [pageData, setPageData] = useState()
	const [searchData, setSearchData] = useState('')
	const [filters, setFilters] = useState({
		sentiment: '',
		sources: '',
		categories: '',
	})
	const [date, setDate] = useState({ start_date: '', end_date: '' })
	const BASE_URL = 'https://get.scrapehero.com/news-api'
	const API_KEY = process.env.REACT_APP_APIKEY

	const getNews = async () => {
		const data = await apiCall({
			baseURL: `${BASE_URL}/news/?${searchData ? `q=${searchData}&` : ''}${
				filters.sentiment ? `sentiment=${filters.sentiment}&` : ''
			}${date.start_date ? `start_date=${date.start_date}&` : ''}${
				date.end_date ? `end_date=${date.end_date}&` : ''
			}${filters.sources ? `source_id=${filters.sources}&` : ''}${
				filters.categories ? `category_id=${filters.categories}&` : ''
			}x-api-key=${API_KEY}`,
		})
		setNewsData(data.result.data)
		setNextPageUrl(data.result.nextUrl)
	}

	const handleDateChange = (values: any) => {
		if (values) {
			setDate({
				start_date: format(new Date(values[0]), 'yyyy-MM-dd'),
				end_date: format(new Date(values[1]), 'yyyy-MM-dd'),
			})
		}
	}
	const handleSearchChange = (event: any) => {
		setTimeout(() => setSearchData(event.target.value), 3000)
	}
	const handleFilterChange = (values: any) => {
		if (values) {
			setFilters((previousState) => ({
				...previousState,
				sentiment: values.sentiment,
				sources: values.source,
				categories: values.category,
			}))
		}
	}
	const handleChangeNextPage = async () => {
		const data = await apiCall({
			baseURL: `https://cors-anywhere.herokuapp.com/${nextPageUrl}&x-api-key=${API_KEY}`,
		})
		setNewsData(data.result.data)
		setNextPageUrl(data.result.nextUrl)
		window.scrollTo(0, 0)
	}
	useEffect(() => {
		getNews()
	}, [date, searchData, filters])
	return (
		<>
			<Header
				onSearch={handleSearchChange}
				BASE_URL={BASE_URL}
				onSubmit={handleFilterChange}
				APIKEY={API_KEY}
			/>
			<Row justify='center'>
				<Col lg={pageData ? 5 : 18} className='mv3 mh5'>
					<DatePicker.RangePicker
						onChange={handleDateChange}
						format='yyyy-MM-DD'
						allowClear={true}
					/>
					{newsData &&
						newsData.map((news) => (
							<div
								className='shadow-hover pa1'
								key={news['title']}
								onClick={() => setPageData(news)}>
								<h3 className='mt3 gray'>
									{format(new Date(news['date']), 'MMMM dd , yyyy')}
								</h3>
								<h3 className='b'>{news['title']}</h3>

								<Row align='middle'>
									<span
										className='status'
										style={{
											backgroundColor:
												news['sentiment'] === 'Positive'
													? 'green'
													: news['sentiment'] === 'Negative'
													? 'red'
													: 'grey',
										}}
									/>
									<div className='ml2'>{news['parent_classification']}</div>
								</Row>
								<Divider />
							</div>
						))}
				</Col>
				{pageData && (
					<>
						<Col lg={1}>
							<Divider plain={false} type='vertical' />
						</Col>
						<Col className='mt3' lg={pageData ? 14 : 0}>
							<h1 className='fw6'>{pageData['title']}</h1>
							<Row justify='space-between'>
								<h4 className='mt3'>{pageData['publication']}</h4>
								<h4 className='mt3 gray'>
									{format(new Date(pageData['date']), 'MMMM dd , yyyy')}
								</h4>
							</Row>
							<Divider />
							<h4 className='tj'>{pageData['content']}</h4>
						</Col>
					</>
				)}
			</Row>
			<Row justify='center' className='pv5'>
				<Button
					onClick={handleChangeNextPage}
					type='primary'
					icon={<DoubleRightOutlined />}>
					Next Page
				</Button>
			</Row>
		</>
	)
}

export default App
