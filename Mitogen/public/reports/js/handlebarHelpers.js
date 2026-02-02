 $(function () {


          // if equalss
          Handlebars.registerHelper('if_eq', function(a, b, opts) {
              if (a == b) {
                  return opts.fn(this);
              } else {
                  return opts.inverse(this);
              }
          });

          // if with operators
          Handlebars.registerHelper('iff', function(a, operator, b, opts) {
              var bool = false;
              switch(operator) {
                 case '==':
                     bool = a == b;
                     break;
                 case '!=':
                     bool = a != b;
                     break;
                 case '>':
                     bool = a > b;
                     break;
                 case '<':
                     bool = a < b;
                     break;
                 default:
                     throw "Unknown operator " + operator;
              }

              if (bool) {
                  return opts.fn(this);
              } else {
                  return opts.inverse(this);
              }
          });

          //limit each
          Handlebars.registerHelper('each_upto', function(ary, max, options) {
              if(!ary || ary.length == 0)
                  return options.inverse(this);

              var result = [ ];
              for(var i = 0; i < max && i < ary.length; ++i)
                  result.push(options.fn(ary[i]));
              return result.join('');
          });

          //limit each start and stop
          Handlebars.registerHelper('each_from_to', function(ary, min, max, options) {
              if(!ary || ary.length == 0)
                  return options.inverse(this);

              var result = [ ];
              for(var i = min; i < max && i < ary.length; ++i)
                  result.push(options.fn(ary[i]));
              return result.join('');
          });

 });