using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;

namespace API.ModelBinders
{
    public class JsonQueryBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var queryString = bindingContext.ActionContext.HttpContext.Request.QueryString.ToString();
            var queryDictionary = QueryHelpers.ParseQuery(queryString);

            if (queryDictionary.ContainsKey("filter") && !queryDictionary.ContainsKey("range"))
            {
                var manyQueryResult = new AdminManyQueryParams
                {
                    Filter = JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(queryDictionary["filter"])
                };
                
                bindingContext.Result = ModelBindingResult.Success(manyQueryResult);
                return Task.CompletedTask;
            }
            
            var listQueryResult = new AdminListQueryParams();
            
            if (queryDictionary.TryGetValue("filter", out var filtersValue))
                listQueryResult.Filter = JsonConvert.DeserializeObject<Dictionary<string, string>>(filtersValue);

            if (queryDictionary.TryGetValue("range", out var rangeValue))
                listQueryResult.Range = JsonConvert.DeserializeObject<List<int>>(rangeValue);

            if (queryDictionary.TryGetValue("sort", out var sortValue))
                listQueryResult.Sort = JsonConvert.DeserializeObject<List<string>>(sortValue);

            bindingContext.Result = ModelBindingResult.Success(listQueryResult);
            return Task.CompletedTask;
        }
    }
}