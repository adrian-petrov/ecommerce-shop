using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Authorisation;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminOptionsController : BaseAdminController
    {
        private readonly IGenericRepository<Option> _optionsRepository;
        private readonly IGenericRepository<OptionValue> _optionValuesRepository;
        private readonly IMapper _mapper;

        public AdminOptionsController(
            IGenericRepository<Option> optionsRepository,
            IGenericRepository<OptionValue> optionValuesRepository,
            IMapper mapper)
        {
            _optionsRepository = optionsRepository;
            _optionValuesRepository = optionValuesRepository;
            _mapper = mapper;
        }

        [HttpGet("options")]
        public async Task<ActionResult<AdminGetListResponseDto<AdminOptionResponseDto>>> GetListOptions(
            AdminListQueryParams listQueryParams)
        {
            var options = await _optionsRepository.ListAllAsync();
            var dto = _mapper.Map<IReadOnlyList<AdminOptionResponseDto>>(options);
            
            var response = new AdminGetListResponseDto<AdminOptionResponseDto>
            {
                Data = dto,
                Total = dto.Count
            };
            
            var from = listQueryParams.Range.First();
            var to = listQueryParams.Range.Last();
            
            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Add("Content-Range", $"products {from}-{to}/{options.Count}");
            
            return response;
        }

        [HttpGet("optionvalues")]
        public async Task<ActionResult<AdminGetListResponseDto<AdminOptionValueResponseDto>>>
            GetListOptionValues(AdminListQueryParams listQueryParams)
        {
            var spec = new AdminOptionValuesWithOptionNamesSpecification();
            var optionValues = await _optionValuesRepository.ListAsync(spec);
            var dto = _mapper.Map<IReadOnlyList<AdminOptionValueResponseDto>>(optionValues);
            
            var response = new AdminGetListResponseDto<AdminOptionValueResponseDto>
            {
                Data = dto,
                Total = dto.Count
            };
            
            var from = listQueryParams.Range.First();
            var to = listQueryParams.Range.Last();
            
            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Add("Content-Range", $"products {from}-{to}/{optionValues.Count}");
            
            return response;
        }
    }
}