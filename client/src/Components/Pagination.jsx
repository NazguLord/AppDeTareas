import React from 'react'
//import '../Styles/pagination.css';

const Pagination = ({medicamentosPerPage, totalMedicamentos, currentPage, setCurrentPage}) => {
const pageNumbers = []

for (let i = 1; i <= Math.ceil(totalMedicamentos / medicamentosPerPage); i++){
    pageNumbers.push(i);
}

 const onPreviosPage = () => {
   if(currentPage!==1) setCurrentPage(currentPage - 1)
 }

 const onNextPage = () => {
   if(currentPage !== pageNumbers.length) setCurrentPage(currentPage + 1)
 }

 const onSpecigicPage = (n) =>{
    setCurrentPage(n)
 }

  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
    <button className={`pagination-previous ${currentPage === 1 ? 'is-disabled' : '' }`} onClick={onPreviosPage} >Anterior</button>
    <button className={`pagination-next ${ currentPage >= pageNumbers.length ? 'is-disabled' : ''}`} onClick={onNextPage}>Siguiente</button>
    <ul className="pagination-list">
        {pageNumbers.map(noPage => (
            <li key={noPage}>
                <button className={`pagination-link ${noPage === currentPage ? 'is-current' : ''}`} onClick={() => onSpecigicPage(noPage)}>{noPage}</button>
            </li> 
        ))}   
    </ul>
  </nav>
  )
}

export default Pagination